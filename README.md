# Advent of Code Template

## Setup

Fork this repo and run `npm install` to install dependecies.

## Running

To use this project simply run `npm run dev` with a number between 1 and 25 like this: `npm run dev 7`. This will generate a new folder inside the src folder containing a template for solving the puzzles. The template includes two different functions to be used when solving the two tasks of each day. To supply the functions with the input needed either copy the .env.example file and rename it to .env, then add your session cookie from https://adventofcode.com/ as a value for AOC_TOKEN=. You can also do it manually by simply pasting the input from the advent of code site into the input file located in the current days folder e.g: `src/7/input` for day 7s input.

The `dev` command will also run the code and output the value returned by the two functions to the console and meassure time spent. The command also watches files for changes and re-runs the code on change.

Once you're pleased with your solution simply copy the result from the console and paste it into the site!
