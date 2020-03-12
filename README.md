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

8. Type and run the command below to run the server.

    ```
    yarn start
    ```

9. Check Discord. Your bot should now be running.

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
    python scrape_archive.py
    ```

5. Update your .env file with the correct values for each variable.

## Discord Usage

Commands can be either uppercase or lowercase.

1. Generate random question with optional 20 or 30 second timer:

    ```
    .trebot question [20|30]
    .trebot q [20|30]
    ```

2. Guess the answer of a previously generated question. Once the answer is correctly guessed, it will be automatically revealed and the score for the winning contestant will be increased. Will not work with timed questions. (**BETA** -- will have false negatives/positives):

    ```
    .trebot answer <answer text>
    .trebot a <answer text>
    ```

3. Reveal answer of previously generated question:

    ```
    .trebot answer
    .trebot a
    ```

4. Reveal score for each contestant in the server:

    ```
    .trebot score
    .trebot s
    ```

5. **.trebot** can also be shortened to **.tre** or **.t**.
