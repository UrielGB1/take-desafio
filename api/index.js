const app = require('express')();
const PORT = 8080;
//import { XMLHttpRequest } from "xmlhttprequest";
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
var dateArray = []

//função que coleta os dados do GitHub assincronamente
function httpRequest(address, reqType, asyncProc) {
    var req = new XMLHttpRequest();
    if (asyncProc) {
        req.onreadystatechange = function() {
            if (this.readyState == 4) {
                asyncProc(this);
            }
        };
    } else {
        req.timeout = 4000;
    }
    req.open(reqType, address, !(!asyncProc));
    req.send();
    return req;
}

//coletando a resposta e convertendo para um objeto JSON
var response = httpRequest('https://api.github.com/users/takenet/repos', 'get', false);
var responseObj = JSON.parse(response.responseText);

//ordena o array de objetos baseado na data de criação, em ordem crescente

responseObj.sort((a,b) => {
    var dateA = new Date(a.created_at);
    var dateB = new Date(b.created_at);

    return dateA.getTime()-dateB.getTime();
});

//dataObjects in dateArray já estão ordenados pela função sort acima
for(var x in responseObj) {
    dateArray[x] = new Date(responseObj[x].created_at);
}

//dateArray agora está ordenado, com o objeto na posição 0 sendo o mais antigo.

/*
--  o chatbot deve listar informações sobre os 5 repositórios de linguagem C# mais antigos da Take,
    ordenados de forma crescente por data de criação.
--  A imagem de cada card do carrossel deve ser o avatar da Take no GitHub. 
--  O título de cada card deve ser o nome completo do repositório 
--  o subtítulo deve ser a descrição do repositório.

responseObj[i].language => descreve a linguagem usada pelo repositório, que deve ser C#
responseObj[i].owner.avatar_url => a url da imagen usada como avatar
responseObj[i].full_name => nome completo do repositório, que deve ser o título
responseObj[i].description => descrição do repositório, que deve ser o subtítulo


*/
//função repo_info deve retornar as informações dos cinco repositórios mais antigos que atendem aos critérios detalhados acima
function repo_info(repoArray) {
    let repo_info_obj = [
        {
            title : 'titulo1',
            subtitle : 'subtitulo1',
            avatar_url : 'url1'
        },
        {
            title : 'titulo2',
            subtitle : 'subtitulo2',
            avatar_url : 'url2'
        },
        {
            title : 'titulo3',
            subtitle : 'subtitulo3',
            avatar_url : 'url3'
        },
        {
            title : 'titulo4',
            subtitle : 'subtitulo4',
            avatar_url : 'url4'
        },
        {
            title : 'titulo5',
            subtitle : 'subtitulo5',
            avatar_url : 'url5'
        }
    ];
    var i = 0;
    var j;
    for(j in repoArray) {
        if(repoArray[j].language == 'C#') {
            repo_info_obj[i].title = repoArray[j].full_name;
            repo_info_obj[i].subtitle = repoArray[j].description;
            repo_info_obj[i].avatar_url = repoArray[j].owner.avatar_url;
            i++;
        }
        if(i>=5) break
    }
    return repo_info_obj;
}

//eventualmente, deve ser modificada para enviar os cinco repositórios mais antigos do Github da TakeBlip
app.get('/repos', (req, res) => {
    res.status(200).send({
        response: repo_info(responseObj)
    })
});



app.listen(PORT);