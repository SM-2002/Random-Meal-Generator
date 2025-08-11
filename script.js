document.addEventListener('DOMContentLoaded', () => {
    const getMealBtn = document.getElementById('get-meal-btn');
    const mealContainer = document.getElementById('meal-container');
    const errorMsg = document.getElementById("error-message");
    const loader = document.getElementById('loader');
    const mealName = document.getElementById('meal-name');
    const mealImage = document.getElementById('meal-image');
    const mealCategory = document.getElementById('meal-category');
    const mealIngredientsList = document.getElementById('meal-ingredient');
    const mealYoutubeLink = document.getElementById('youtube');
    const mealInstructions = document.getElementById('meal-instructions');

    // force initial hidden state on page load

    loader.hidden = true;
    errorMsg.hidden = true;
    mealName.hidden = true;
    mealCategory.hidden = true;
    mealImage.hidden = true;
    mealIngredientsList.hidden = true;
    mealYoutubeLink.hidden = true;
    mealInstructions.hidden = true;
    mealContainer.hidden = true;


    getMealBtn.addEventListener('click', async () => {
        mealName.textContent = '';
        mealImage.innerHTML = '';
        mealCategory.textContent = '';
        mealIngredientsList.innerHTML = '';
        mealYoutubeLink.innerHTML = '';
        mealInstructions.textContent = '';

        loader.hidden = false;
        mealContainer.hidden = true;
        errorMsg.hidden = true;

        try {
            const mealdata = await fetchMeal();
            displayMeal(mealdata);
            loader.hidden = true;
        } catch (error) {
            showError();
        }
    })

    async function fetchMeal() {
        const url = 'https://api.freeapi.app/api/v1/public/meals/meal/random';

        const response = await fetch(url);
        const mealdata = await response.json();

        if (!mealdata.success) {
            throw new Error("Error in generating meal");
        }

        return mealdata;
    }

    function displayMeal(mealData) {
        console.log(mealData);

        const {
            strMeal,
            strMealThumb,
            strYoutube,
            strCategory,
            strInstructions,
            ...rest
        } = mealData.data;

        // show meal container
        loader.hidden = true;
        mealContainer.hidden = false;
        errorMsg.hidden = true;

        mealName.hidden = false;
        mealCategory.hidden = false;
        mealImage.hidden = false;
        mealIngredientsList.hidden = false;
        mealYoutubeLink.hidden = false;
        mealInstructions.hidden = false;


        // Set Meal Name and Category
        mealName.textContent = strMeal;
        mealCategory.textContent = `Category : ${strCategory}`;

        // Set Meal Image
        mealImage.innerHTML = `<img src = "${strMealThumb}" alt = "${strMeal}" /> `;

        // Set Ingredients List
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
            const ingredient = rest[`strIngredient${i}`];
            const measure = rest[`strMeasure${i}`];

            if (ingredient && ingredient.trim() != "") {
                ingredients.push(`<li> <strong>${ingredient}</strong> - ${measure} </li> `);
            }
        }

        mealIngredientsList.innerHTML = `<ul> ${ingredients.join("")} </ul>`;

        // Set Youtube Link
        if (strYoutube) {
            const youtubeEmbedUrl = strYoutube.replace("https://www.youtube.com/watch?v=", "https://www.youtube.com/embed/");

            mealYoutubeLink.innerHTML = `
                <iframe 
                    width="100%"
                    height="100%"
                    src="${youtubeEmbedUrl}"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            `;   
        } else {
            mealYoutubeLink.innerHTML = `<h4>Sorry, No Youtube Link is Available.</h4>`
        }

        // Set Instructions
        mealInstructions.textContent = `Instructions : ${strInstructions}`;
    }

    function showError() {
        mealContainer.hidden = true;
        errorMsg.hidden = false;
    }
})