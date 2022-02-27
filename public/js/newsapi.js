var url = "http://newsapi.org/v2/top-headlines?country=in&category=technology&apiKey=7a553c96880846e7b40d336aae6d021e";

$.get(url, (response)=>{
    console.log(response.articles);
    for(let i=0; i<5; i++){
        let x = Math.floor(Math.random() * (response.articles.length - 0) + 0); 
        var html = `<div class="card" style="width: 18rem;">
                        <img src="${response.articles[x].urlToImage}" class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">${response.articles[x].title}</h5>
                            <p class="card-text">${response.articles[x].description}</p>
                            <a href="${response.articles[x].url}" class="btn btn-primary">read more</a>
                        </div>
                    </div>`
        $(".newsContainer").append(html);
    }
    
})