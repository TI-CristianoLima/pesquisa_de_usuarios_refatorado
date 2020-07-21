let inputText= null;
let inputBtn = null;
let titleStatistics = null;
let progress = null;
let canvasGroup = null;
let maleTitle = null;
let femaleTitle = null;
let age030 = null;
let age3160 = null;
let age60up = null;
let allUsers = null;
let mediaAge = null;
let userCard = null;
let resFilter = null;
let inputUser = null;
let totalAge = null;
let age030Title = null;
let age3160Title = null;
let title = null;
let media = null;
let mediafor = null;

window.addEventListener("load", () => {
  titleStatistics = document.querySelector("#title-statistics");
  progress = document.querySelector("#progress");
  inputText = document.querySelector("#input-text");
  inputBtn = document.querySelector("#btn");
  canvasGroup = document.querySelector("#canvas-group");
  maleTitle = document.querySelector("#male-title");
  femaleTitle = document.querySelector("#female-title");
  age030Title = document.querySelector("#age-0-30");
  age3160Title = document.querySelector("#age-31-60");
  title = document.querySelector("#age-60");
  media = document.querySelector("#media");
  userCard = document.querySelector("#user-card");
  numberFormat = Intl.NumberFormat('pt-BR');


  fetchUsers();
  // renderUser();
  activateImput();
  clickBtn();
  setTimeout(() => {
    progress.classList.add('d-none');
    titleStatistics.textContent = `Faça sua pesquisa, digitando no campo acima.`
    inputBtn.removeAttribute("disabled");
    inputText.removeAttribute("disabled");    
    inputText.focus();
  }, 1170);
});

async function fetchUsers() {
  const res = await fetch(
    "https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo"
  );
  const json = await res.json();
  allUsers = json.results.map(user => {
    const { picture, name, gender, dob } = user;

    return {
      picture: picture.medium,
      name: name.first+ ' ' + name.last,
      gender,
      age: dob.age,
    };
  });
}

function filterInput(inputUser){
  if (inputUser !== ''){
    resFilter = allUsers.filter(user => {
      let userCase = user.name.toLowerCase();
      return userCase.includes(inputUser);    
    });  
      console.log(resFilter);
  totalAge = resFilter.reduce((acc, curent) => {
    return acc + curent.age;
  }, 0);
      age030 = resFilter.reduce((acc, curent) => {
        return acc + (curent.age <= 30);
      }, 0);
      age3160 = resFilter.reduce((acc, curent) => {
        return acc + (curent.age > 30 && curent.age <= 60);
      }, 0);
      age60up = resFilter.reduce((acc, curent) => {
        return acc + (curent.age > 60);
      }, 0);
    sexMasc = resFilter.reduce((acc, curent) => {
      return acc + (curent.gender === 'male' );
    }, 0);
    console.log(sexMasc);
    sexFem = resFilter.reduce((acc, curent) => {
      return acc + (curent.gender === 'female' );
    }, 0);
    console.log(sexFem);
    totalUser = resFilter.length;  
    mediaAge = totalAge / totalUser;
    const totalAgeFor = formatNumber(totalAge);
    mediafor = formatNumber(mediaAge);
  if (totalUser > 1){
    titleStatistics.textContent = `${totalUser} usuários encontrados`;
    renderCanvas();
  }else if (totalUser === 1){
    titleStatistics.textContent = `${totalUser} usuário encontrado`;
    renderCanvas();   
  }else{
    titlestatistics.textContent = `Nenhum usuário encontrado`;    
  }
  renderUser();
}else{
  return;   
}

}


function renderUser(){
  let usersHTML = "";
  if (resFilter !== ''){
    resFilter.forEach(user =>{
      const {picture, name, age} = user;
      const userHTML = `
      <div class="col-6 mb-3 col-lg-2">
      <div class="card h-100 shadow-lg">
      <img class="card-img-top " src="${picture}" alt="Imagem de usuario">
      <div class="card-body text-center">
      <h5 class="card-title">${name}</h5>
      <p class="card-text">${age} anos.</p>
      </div>
      </div>
      </div>
      `;
      usersHTML += userHTML;
    });
    userCard.innerHTML = usersHTML;
  }
}

function clickBtn(){
  function mouseUp(){
    let inputCase = inputText.value.toLowerCase();
    console.log(inputCase);
    filterInput(inputCase);
    inputText.focus();
  }
  inputBtn.addEventListener('mouseup', mouseUp);
}

function activateImput(){
  function handleTyping(event){
    let inputCase = event.target.value.toLowerCase();
    if (event.key === 'Enter'){
      console.log(event);
      filterInput(inputCase);
    }else if (event.target.value !== ''){
      inputBtn.classList.remove('disabled');
    }    
    else{
      inputBtn.classList.add('disabled');
      canvasGroup.classList.add('d-none');
      resFilter = '';
      userCard.innerHTML = '';      
      titleStatistics.textContent = `Faça sua pesquisa, digitando no campo acima.`;
    }
  }

  inputText.focus();
  inputText.addEventListener('keyup', handleTyping);
}

function formatNumber(number){
  return numberFormat.format(number);
}


function renderCanvas(){
canvasGroup.removeAttribute("class");
let ctxAge = document.querySelector('#age');
let ctxGender = document.querySelector('#gender');
age030Title.textContent = `0 a 30 anos (${age030}).`;
age3160Title.textContent = `31 a 60 anos (${age3160}).`;
title.textContent = `Acima de 60 anos (${age60up}).`;
media.textContent = `Idade média, (${mediafor}).`;
maleTitle.textContent = `${sexMasc} Homens.`;
femaleTitle.textContent = `${sexFem} Mulheres.`;


  const chartGender = new Chart(ctxGender, {
    type: 'doughnut',
    data: {
      labels: ['Homem','Mulher'],
      datasets: [{
          label: ['Homem', 'Mulher'],
          data: [sexMasc, sexFem],
          backgroundColor: [
             'rgba(54, 162, 235, 1)',
             'rgba(255, 99, 132, 1)'
          ],
          borderWidth: 1
      }]    
  },
  options: {
    title:{
      text: 'Sexo',
      display: true,
      fontSize: 20,
      fontColor: 'black'
    }  
  }
  }
);

const chartAge = new Chart(ctxAge, {
  type: 'bar',
  data: {
      labels: ['0 a 30', '31 a 60', 'acima de 60'],
      datasets: [{
          label: 'Faixa Etária',
          data: [age030, age3160, age60up],
          backgroundColor: [
              'rgba(54, 162, 235, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
              'rgba(54, 162, 235, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
      }]
  },
  options: {
      scales: {
          yAxes: [{
              ticks: {
                  beginAtZero: true
              }
          }]
      }
  }
});
}