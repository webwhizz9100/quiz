var quiz = {

    originalQuestions: [],

    finalQuestions: [],

    answers: false,

    HTML: {

        ul: document.getElementById('questions'),
        li: document.getElementById('question-template').innerHTML
        
    },

    init : function() {
        
        fetch('https://opentdb.com/api.php?amount=20&category=18&difficulty=easy&type=multiple')
        .then(function(questions){ return questions.json()})
        .then(function(questions){

            quiz.originalQuestions = questions;

            quiz.finalQuestions = quiz.randomFromArray(questions.results, 10)

            quiz.renderQuestions();
        })     
    },

    renderQuestions: function(){

        quiz.finalQuestions.map(function(question, index){

            question.answers = question.incorrect_answers
            question.answers.push(question.correct_answer)

            question.answers = quiz.shuffle(question.answers)

            question.id = `question-${index}`;

            question.answers = question.answers.map(function(answer){

                return {answer : answer}

            })

            questionTemplate = Mustache.render(quiz.HTML.li, question);

            quiz.HTML.ul.innerHTML += questionTemplate;		

        });
    },


    checkAnswers: function(){
      
        quiz.setAnswers();

        var score = quiz.answers.score;

        document.getElementById('score').innerHTML = Mustache.render(`

            <h2>You got ${score} right!</h2>

        `,{score: score}
        );

        window.scrollTo({
            top: 0,
            behavior: 'smooth'


        })
  
    },

    setAnswers: function(){

        // loop all answers and build answers

        var questions = document.querySelectorAll('.question');

        quiz.answers = {};
        quiz.answers.score = 0;
        quiz.answers.results = [];


        questions.forEach(function(question, index){

            var originalQuestion = quiz.finalQuestions[index];


            if(question.querySelector('input:checked')) {
                var answer = question.querySelector('input:checked').value;
            } else {
                var answer = '';
            }

            if(answer == quiz.finalQuestions[index].correct_answer) {
                var response = 'correct';
                quiz.answers.score = quiz.answers.score + 1 ;
            } else {
                var response = 'wrong';
            }

            originalQuestion.user_answer = answer;

            originalQuestion.response = response;

            quiz.answers.results.push(originalQuestion);
                 
        })

    },

    shuffle: function(array){

        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;

    },

    randomFromArray: function(arr, n){

        var result = new Array(n),
            len = arr.length,
            taken = new Array(len);
        if (n > len)
            throw new RangeError("getRandom: more elements taken than available");
        while (n--) {
            var x = Math.floor(Math.random() * len);
            result[n] = arr[x in taken ? taken[x] : x];
            taken[x] = --len in taken ? taken[len] : len;
        }

        return result;

    }
}