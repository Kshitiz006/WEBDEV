const generateForm = document.querySelector(".generate-form")
// get the first element with class = "generate-form"
const imageGallery = document.querySelector(".image-gallery")

//generating images for a user prompt
//we will use the openAI API to generate images based on user prompts

const OPENAI_API_KEY = "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";
let isImageGenerated = false;

const updateImageCard = (imgDataArray) => {
    imgDataArray.forEach((imgObject , index) =>{
            const imgCard = imageGallery.querySelectorAll(".img-card")[index];
            const imgElement = imgCard.querySelector("img");
            const downloadBtn = imgCard.querySelector(".download-btn");
            //Set the image source to the AI-generated image data
            const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64_json}`;
            imgElement.src= aiGeneratedImg;

            //When the image is loaded,reove the loading class and set download attributes
            imgElement.onload = () => {
                imgCard.classList.remove("loading");
                downloadBtn.setAttribute("href",aiGeneratedImg);
                downloadBtn.setAttribute("download",`${new Date().getTime()}.jpg`);
            }
    })
}

const generateAiImages = async(userPrompt,userImgQuantity) =>{
    try{
        //Send a request to the OpenAI API to generate images based on user inputs
        const response = await fetch("https://api.openai.com/v1/images/generations",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                prompt: userPrompt,
                n: parseInt(userImgQuantity),
                size: "512x512",
                response_format: "b64_json"
            })
        });
        
        if(!response.ok) throw new Error("Failed to generate images! Please try again.");

        const { data } = await response.json(); //Get data from the response
        //let's show the images from the image gallery
        updateImageCard([...data])
        console.log(data)
    }catch(error){
        alert(error.message)
        console.log(error);
    }finally{
        isImageGenerated = false;
    }
}

const handleFormSubmission = (e) => {
    e.preventDefault();
    if(isImageGenerated) return;
    isImageGenerated = true;

    //Get user input and image quantity values from the form
    const userPrompt = e.srcElement[0].value;
    const userImgQuantity = e.srcElement[1].value;

    const imgCardMarkup = Array.from({length: userImgQuantity} , () =>
    `<div class="img-card loading">
    <img src="images/loader.svg" alt="image">
    <a href="#" class="download-btn">
        <img src="images/download.svg" alt="download icon">
    </a>
    </div>`

    ).join("")

    imageGallery.innerHTML = imgCardMarkup;
    generateAiImages(userPrompt,userImgQuantity);
    // console.log(imgCardMarkup);
    // console.log(userPrompt,userImgQuantity);
    // console.log(e.srcElement);
}

// the preventDefault() method cancels the event if it is cancelable, meaning that the default action that belongs to the event will not occur.

// For example, this can be useful when:

// Clicking on a "Submit" button, prevent it from submitting a form
// Clicking on a link, prevent the link from following the URL

generateForm.addEventListener("submit", handleFormSubmission)
// addEventListener attaches an event to the document
// syntax : document.addEventListener("click",myFunction)



