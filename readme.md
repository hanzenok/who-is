## Chat bot built with Google Cloud technologies

### On local

```
npm install

export GOOGLE_APPLICATION_CREDENTIALS="<credentials path>.json"
export PROJECT_ID="<project id>"

npm start
```

### To deploy

Add the `app.yaml` file to the project and then

```
gcloud auth login
gcloud app deploy
```