# Trebot

He helps you play Jeopardy on Discord. Over 350,000 trivia questions available.

## Installation

1. Download the latest versions of [Node.js](https://nodejs.org/en/) and [MongoDB](https://www.mongodb.com/).

2. Set up a cloud database. I used [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

3. Create a Discord bot using [this guide](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token).

4. Clone the repository or download the zip file.

5. Use terminal/cmd/powershell/something similar to navigate to the directory with the files and type the command below. This will automatically install all dependencies listed in the **package.json** file.

    ```
    yarn install
    ```

6. Follow the instructions below for scraping J-Archive and creating your database.

7. Copy the contents of .env.example and create a new .env file with the contents pasted inside. Put the appropriate values in their spots. The URI should be provided by MongoDB Atlas or whatever database you are using.

8. Type and run the command below to generate the commands in the approproate guild.

    ```
    yarn commands
    ```

9. Type and run the command below to run the server.

    ```
    yarn start
    ```

10. Check Discord. Your bot should now be running.

## J-Archive HTML Scraping

1. Install [Python 3.7](https://www.python.org/downloads/) and the [PyMongo](https://api.mongodb.com/python/current/) and [BeautifulSoup](https://www.crummy.com/software/BeautifulSoup/) packages.

2. Navigate into the /data directory.

    ```
    cd data
    ```

3. Set up a **credentials.json** file in this directory with a URI field. It uses the same URI as that of the .env file from above.

    ```json
    {
      "uri": "<URI HERE>"
    }
    ```

4. To scrape the entire archive of the site, run the following command. This will create a collection in your database with all questions leading up to the most recent episode. It will take some time (between one and two hours).

    ```
    python scrape.py -a
    ```

5. You can also scrape only specific seasons by running the command below. The example shown is for seasons 1 through 10 (will include 10).

    ```
    python scrape.py -s 1 10
    ```

6. Update your .env file with the correct values for each variable.

## Discord Usage

Commands can be either uppercase or lowercase.

1. Generate random question:

    ```
    /question
    ```

2. Show up to three different hints. You have to type the command three separate times to get all the clues. Will remove 25% for each clue from the winning value:

    ```
    /clue
    ```

3. Guess the answer of a previously generated question. Once the answer is correctly guessed, it will be automatically revealed and the score for the winning contestant will be increased. If the answer is incorrectly guessed, the score with decrease. Will not work with timed questions. (**BETA** -- will have false negatives/positives):

    ```
    /answer <answer text>
    ```

4. Reveal answer of previously generated question:

    ```
    /answer
    ```

5. Reveal score for each contestant in the server:

    ```
    /score
    ```
