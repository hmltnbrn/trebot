# Trebot

He helps you play Jeopardy on Discord.

## Installation

1. Download the latest versions of [Node.js](https://nodejs.org/en/) and [MongoDB](https://www.mongodb.com/).

2. Set up a cloud database. I used [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

3. Create a Discord bot using [this guide](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token).

4. Clone the repository or download the zip file.

5. Use terminal/cmd/powershell/something similar to navigate to the directory with the files and type the command below. This will automatically install all dependencies listed in the **package.json** file.

    ```
    npm install
    ```

6. Download the JSON file with the Jeopardy data by searching for it yourself. It's not hard to find. Insert the JSON file into your database by using the terminal and entering the command below. Replace the values between '<>' with your own.

    ```
    mongoimport --jsonArray --host <HOSTNAME> --ssl --username <USERNAME> --password <PASSWORD> --authenticationDatabase admin --db jeopardy --collection public --type json --file <FILENAME>.json
    ```

7. Copy the contents of .env.example and create a new .env file with the contents pasted inside. Put the appropriate values in their spots.

8. Type and run the command below to run the server.

    ```
    npm start
    ```

9. Check Discord. Your bot should now be running.

## Discord Usage

Commands can be either uppercase or lowercase.

1. Generate random question with optional 20 or 30 second timer:

    ```
    !trebot question [20|30]
    !trebot q [20|30]
    ```

2. Reveal answer of previously generated question:

    ```
    !trebot answer
    !trebot a
    ```
