from fastapi import FastAPI, HTTPException, Query, Response, status
from pydantic import BaseModel
from typing import List, Optional
import boto3

app = FastAPI()

# DynamoDB client
dynamodb = boto3.resource('dynamodb')

boards_table = dynamodb.Table("boards")
tasks_table = dynamodb.Table("tasks")

# Models
class Board(BaseModel):
    id: int
    name: str
    description: Optional[str] = None

class Task(BaseModel):
    id: int
    boardId: int
    name: str
    description: Optional[str] = None
    status: str

class TaskUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None


@app.get("/")
def root():
    return Response(status_code=status.HTTP_200_OK)

@app.get("/boards", response_model=List[Board])
def get_boards():
    response = boards_table.scan()
    return response.get("Items", [])

@app.post("/tasks", response_model=Task)
def create_task(task: Task):
    tasks_table.put_item(Item=task.dict())
    return task

@app.put("/tasks/{task_id}", response_model=Task)
def update_task(task_id: str, task_update: TaskUpdate):
    update_expression = []
    expression_values = {}
    for field, value in task_update.dict(exclude_unset=True).items():
        update_expression.append(f"{field} = :{field}")
        expression_values[f":{field}"] = value

    if not update_expression:
        raise HTTPException(status_code=400, detail="No fields to update")

    try:
        response = tasks_table.update_item(
            Key={"taskId": task_id},
            UpdateExpression="SET " + ", ".join(update_expression),
            ExpressionAttributeValues=expression_values,
            ReturnValues="ALL_NEW"
        )
    except tasks_table.meta.client.exceptions.ConditionalCheckFailedException:
        raise HTTPException(status_code=404, detail="Task not found")

    return response["Attributes"]

@app.get("/tasks", response_model=List[Task])
def get_tasks(boardId: str = Query(...)):
    response = tasks_table.query(
        IndexName="boardId-index",  # Asegúrate de tener este GSI
        KeyConditionExpression=boto3.dynamodb.conditions.Key("boardId").eq(boardId)
    )
    return response.get("Items", [])
