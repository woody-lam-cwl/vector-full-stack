FROM python:latest

WORKDIR /usr/src/server

COPY . .

RUN pip3 install -r requirements.txt

EXPOSE 8000

CMD ["python", "server.py"]