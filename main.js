
 //getData
const apiUrl = "https://demo5798148.mockable.io"//"https://api.sheety.co/30b6e400-9023-4a15-8e6c-16aa4e3b1e72";
//enviando cardsContainer div id cards html
const cardsContainer=document.querySelector("#cards");
//instanciando variaveis
let data = [];
let checkin = document.getElementById('checkin-input');
let checkout = document.getElementById('checkout-input');
let cidade = document.getElementById('local');
checkin.valueAsDate = new Date();
checkout.valueAsDate = new Date();
let daysPeriod = 0;
let currentPage = 1;
let numberOfPages = 0
let numberObjPerPage = 5;

//funcoes estruturar paginacao
function paginateEvent() {
	document.getElementById('next').disabled = currentPage === numberOfPages ? true : false;
	document.getElementById('previous').disabled = currentPage === 1 ? true : false;
}

function getNumberOfPages(data) {
	numberOfPages = Math.ceil(data.length / numberObjPerPage);
}

function loadObjs(data) {
	let ini = ((currentPage - 1) * numberObjPerPage);
	let end = ini + numberObjPerPage;
	let datas = Object.keys(data)
		.slice(ini, end)
		.reduce((result, key) => {
			result.push(data[key]);
			return result;
		}, []);

	paginateEvent();
	return datas;
};

function next(data) {
	currentPage += 1;
	
	getNumberOfPages(data);
};

function prev(data) {
	currentPage -= 1;
	
	getNumberOfPages(data);
};
//funcao filtrar busca
function filter(city, data) {
  let dados = [];
	const response = []
  
  let i = 0
  
  for(i ;i<data.length;i++){
  let cida = city
  console.log(cida)
	if(cida == data[i].cidade){
    console.log("ok")
    dados.push(data[i])
  }else{
    if(cida != "Botucatu" && cida != "São Manuel" && cida !=" São Paulo"){
    alert("nao ha propriedades neste local");
    break;
    }
     
  }
  
  }
  console.log(dados)
  cardsContainer.innerHTML = "";
  dados.map(renderCard);
}
//funcao buscar geolocalizacao
 
const apiMapKey = 'AIzaSyCnqtwJKIoDl6ShU2rpk9Vai0rjIOd8Vqk';

let script = document.createElement('script');
script.src = `https://maps.googleapis.com/maps/api/js?key=${apiMapKey}&callback=initMap`;
script.defer = true;
script.async = true;

document.head.appendChild(script);

function showPosition(data){
  for(let i = 0; i< data.length; i ++){
  lat = data[i].latitude,
  lon=data[i].longitude
  
  }
  
  latlon=new google.maps.LatLng(lat, lon)
  mapholder=document.getElementById('mapholder')
  mapholder.style.height='99.8%';
  mapholder.style.width='100%';
 
  var myOptions={
  center:latlon,zoom:14,
  mapTypeId:google.maps.MapTypeId.ROADMAP,
  mapTypeControl:false,
  navigationControlOptions:{style:google.maps.NavigationControlStyle.SMALL}
  };
  var map=new google.maps.Map(document.getElementById("mapholder"),myOptions);
  for(let i = 0; i< data.length; i ++){
  lat = data[i].latitude,
  lon=data[i].longitude
  var marker=new google.maps.Marker({position:latlon,map:map,title:"Você está Aqui!"});
  }
  }
   
  




//funcoes puxar dados da api e instanciar cardsContaines
async function fetchCards(){
  return await fetch(apiUrl)
  .then(async (response) => await response.json()
  )  
} 
function renderCards(data) {
  let cards = loadObjs(data);
  cardsContainer.innerHTML = "";
  cards.map(renderCard);
  
  
}
function renderCard(card){
  let currency = new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL'
	});
  const div = document.createElement("div");
  div.style.width = "20rem";
  
  div.className = "card";
  div.innerHTML = `
  <img  src= "${card.photo}" class="card-img" alt="imagem invalida"/>
  <div class="card-body">
  <h5 class= "card-title">${card.name}</h5>
  <p class="card-text">
    Cidade: ${card.cidade}
  </p>
  <p class="card-text">
    Tipo: ${card.property_type}
  </p>
  <p class="card-text">
    Preco: ${currency.format(card.price)} 
  </p>
  <p class="card-text">
    Diarias: ${daysPeriod} diárias
  </p>
  <p class="card-text">
   Total de ${currency.format(card.price * daysPeriod)}
  </p>
  
  </div>
  `;
  cardsContainer.appendChild(div);
  console.log(cardsContainer)
}

//buscando dados e puxando p array data
async function main() {
  data = await fetchCards();
  let searchButton = document.getElementById('search-button')
  let searchButtonLocal = document.getElementById('search-buttonlocal')
  let previousPage = document.getElementById('previous');
	let nextPage = document.getElementById('next');
  searchButtonLocal.onclick = () => {
    showPosition(data)
    addMarkers(data)
	}

	searchButton.onclick = () => {
	let ckin = new Date(checkin.value);
	let ckout = new Date(checkout.value);
  let timePeriod = ckout.getTime() - ckin.getTime();
	daysPeriod = timePeriod / (1000 * 3600 * 24);
  let city = (cidade.value);
	filter(city, data);
	}

	previousPage.onclick = () => {
    
		prev (data); 
		renderCards( data);
	}

	nextPage.onclick = () => {
    
		next(data);
    
	  renderCards( data);
	};

	if (data[0]) {
    
    
    renderCards(data)
  }
 
}
main()

