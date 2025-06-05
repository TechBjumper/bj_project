login:
	aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin 718942601884.dkr.ecr.us-east-2.amazonaws.com

build:
	docker build backend -t 718942601884.dkr.ecr.us-east-2.amazonaws.com/formacion3junio/r2:latest

push:
	docker push 718942601884.dkr.ecr.us-east-2.amazonaws.com/formacion3junio/r2:latest