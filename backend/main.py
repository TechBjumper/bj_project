from fastapi import FastAPI, HTTPException, Query, Response, status
from pydantic import BaseModel
from typing import List, Optional, Dict
import boto3
import uvicorn

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
def update_task(task_id: int, task_update: TaskUpdate):
    update_expression = []
    expression_values: Dict[str, any] = {}
    expression_names: Dict[str, str] = {}

    for field, value in task_update.dict(exclude_unset=True).items():
        placeholder_name = f"#{field}"   # e.g. "#status"
        placeholder_value = f":{field}"  # e.g. ":status"

        update_expression.append(f"{placeholder_name} = {placeholder_value}")
        expression_values[placeholder_value] = value
        expression_names[placeholder_name] = field

    if not update_expression:
        raise HTTPException(status_code=400, detail="No fields to update")

    try:
        response = tasks_table.update_item(
            Key={"id": task_id},
            UpdateExpression="SET " + ", ".join(update_expression),
            ExpressionAttributeValues=expression_values,
            ExpressionAttributeNames=expression_names,
            ReturnValues="ALL_NEW"
        )
    except tasks_table.meta.client.exceptions.ConditionalCheckFailedException:
        raise HTTPException(status_code=404, detail="Task not found")

    return response["Attributes"]

@app.get("/tasks", response_model=List[Task])
def get_tasks(boardId: Optional[int] = Query(None)):
    if boardId is not None:
        response = tasks_table.query(
            IndexName="boardId-index",
            KeyConditionExpression=boto3.dynamodb.conditions.Key("boardId").eq(boardId)
        )
    else:
        response = tasks_table.scan()  # trae todas las tareas (peligro con tablas grandes)

    return response.get("Items", [])

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)