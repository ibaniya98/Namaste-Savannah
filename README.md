# Namaste-Savannah

Main Website for Namaste Savannah - [namaste-savannah.com](https://namaste-savannah.com)

## Environment variables

Before you run the application, make sure you have the following environment variables setup:

- Basics (required)

  - `MONGODB_URL`: URL to MongDB instance
  - `SESSION_SECRET`: value used to sign express session cookie

- Contact Form

  - `GOOGLE_CLIENT_ID`: Client ID for OAuth
  - `GOOGLE_CLIENT_SECRET`: Client Secret for OAuth
  - `GOOGLE_RECAPTCHA_SECRET`: Secret for ReCaptcha
  - `RECIPIENT_EMAIL`: Email to which contact message will be sent

- S3 Configuration:
  - `AWS_ACCESS_KEY_ID`
  - `AWS_SECRET_ACCESS_KEY`
  - `AWS_BUCKET_NAME`

See the attached [.env.example](./.env.example) for all environment variables used in the application.

If you want to prevent setting this environment variable every time, run the following command:

```
cp .env.example .env
```

Replace `xxxxx` with the value needed for each environment variable.

This will allow us to load the environment file to Docker image as well for testing purposes using `--env-file` flag.

If you are using `docker compose`, you can also set the environment variables in the [docker-compose.yml](./docker-compose.yml) file.

## Local Development

### Docker Setup

In order to develop locally using Docker, run the following command:

```
npm run docker-compose:dev
```

This command does the following:

- Build a docker image for the application, mount the working directory, and exposes the container in port 8080
- Run MongoDB locally using the Docker image and connect it to the web application

By default, the application can be accessed at [http://localhost:8080](http://localhost:8080).

### No Docker setup

You can run the application locally without using Docker as well.

- Install Nodejs >= 14 ([official page](https://nodejs.org/en/download/)) and verify it:

  ```
  node --version
  ```

- Install all the required dependencies:

  ```
  npm install
  ```

- Setup all required environment variables ([see above](#environment-variables))

- Seed the database with dummy data.

  ```
  npm run db:seed
  ```

  By default, it uses MongoDB running on localhost at port 27017 to create required collections and add data under `namaste-savannah` database.

  If you want to use a different URL for MongoDB, specify it in `MONGODB_URL` environment variable:

  ```
  MONGODB_URL=mongodb+srv://admin:password@my-db.gcp.mongodb.net/prod npm run db:seed
  ```

- Start the web server:

  ```
  npm run start
  ```

## Troubleshooting guide

### Contact Form

The project uses Gmail API to send email to the owners when a contact message is submitted. To facilitate this, we need a token for an account that will be used to send the emails.

If setting up for the first time, login to the application as an administrator and send a `GET` request to `/admin/google/reset-email-token`.

Login with an appropriate account that will be used to send emails. The token will be stored in the database and will be refreshed automatically if required.

**TODO:** Use service account for sending emails.
