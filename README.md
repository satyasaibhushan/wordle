# Wordle Clone

This is a clone of famous game known as [wordle](https://www.nytimes.com/games/wordle/index.html).

* I copied as much as possible from the website iuncluding the colors.

* I also coded a hard mode for this app which can be toggled via a toggle on top-right.

* I added keyboard layout which helps to see the status of every letter.

* Also added toast messages for small alerts.

* This clone also has similar reveal animation as the original.

* I included the same list of words for answers and valid guesses as that of the original's source code.

The preview of the app will look something like this


![alt](/public/assets/sample.png "sample")

## AI stuff

* This part is inspired from [this](https://www.youtube.com/watch?v=v68zYyaEmEA&ab_channel=3Blue1Brown) 3blue1brown's video

* As I alredy wrote a fuction called `getEvaluation` which takes guess and correct answer to give the sting of result which then is used to set the colors of the tiles,

* I repurposed that function it to scan all the words of correct and valid guesses to create a map for each possible outcome which then is used to create a map of probailities.

* Which is used to generate the E value for each word

* formula for E is `E = Σ( p(x)*log2(1/p(x)) )`

* The higher the value of E, the better information we get from that word, the better the result.

So, If we used all the valid guesses as our space of possible correct answers, the following result is obtained.

![alt](/public/assets/results1.png "results1")

If we used only the answers list as our space, which is more effiecient, the following result is obtained.

![alt](/public/assets/results2.png "results2")


###### these results can be seen from running the `bestE` funciton in `AI/information.js` file