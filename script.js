// script.js - fetch countries, render, search, filter, detail view, theme toggle

const API = 'https://restcountries.com/v2/all?fields=name,capital,region,subregion,population,flag,nativeName,topLevelDomain,currencies,languages,borders,alpha3Code';
const fallback = 'data.json';

let countries = [];

const countriesEl = document.getElementById('countries');
const searchInput = document.getElementById('searchInput');
const regionSelect = document.getElementById('regionSelect');
const detailOverlay = document.getElementById('detailOverlay');
const detailBody = document.getElementById('detailBody');
const closeDetail = document.getElementById('closeDetail');
const themeBtn = document.getElementById('themeBtn');
const themeText = document.getElementById('themeText');

// Theme
function loadTheme(){
  const t = localStorage.getItem('theme') || 'dark';
  if(t === 'light'){
    document.documentElement.classList.add('light');
    themeText.textContent = 'Dark Mode'; // show action: switch to Dark
  } else {
    document.documentElement.classList.remove('light');
    themeText.textContent = 'Light Mode'; // show action: switch to Light
  }
}

themeBtn.addEventListener('click', ()=>{
  const cur = localStorage.getItem('theme') || 'dark';
  const next = cur === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', next);
  loadTheme();
});
loadTheme();

// Fetch with fallback
async function fetchCountries(){
  try{
    const res = await fetch(API);
    if(!res.ok) throw new Error('API failed');
    countries = await res.json();
  }catch(e){
    console.warn('Using fallback data.json', e);
    const res = await fetch(fallback);
    countries = await res.json();
  }
  renderCountries(countries);
}

function numberWithCommas(x){
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function renderCountries(list){
  countriesEl.innerHTML = '';
  if(!list.length){
    countriesEl.innerHTML = '<p>No results</p>';
    return;
  }
  list.forEach(c => {
    const el = document.createElement('article');
    el.className = 'card';
    el.tabIndex = 0;
    el.innerHTML = `
      <img class="flag" src="${c.flag || c.flags?.png || ''}" alt="Flag of ${c.name}"/>
      <div class="card-body">
        <h2>${c.name}</h2>
        <p><strong>Population:</strong> ${numberWithCommas(c.population || 0)}</p>
        <p><strong>Region:</strong> ${c.region || ''}</p>
        <p><strong>Capital:</strong> ${c.capital || ''}</p>
      </div>
    `;
    el.addEventListener('click', ()=> showDetail(c.alpha3Code || c.alpha3Code));
    countriesEl.appendChild(el);
  })
}

function showDetail(code){
  // find country by alpha3Code or by name
  const c = countries.find(x => x.alpha3Code === code) || countries.find(x => x.name === code);
  if(!c) return;

  detailBody.innerHTML = `
    <div class="detail-grid">
      <div class="detail-flag">
        <img src="${c.flag || c.flags?.png || c.flags?.svg || ''}" alt="Flag of ${c.name}"/>
      </div>
      <div class="detail-info">
        <h2>${c.name}</h2>
        <div class="detail-columns">
          <div class="col">
            <p><strong>Native Name:</strong> ${c.nativeName || ''}</p>
            <p><strong>Population:</strong> ${numberWithCommas(c.population || 0)}</p>
            <p><strong>Region:</strong> ${c.region || ''}</p>
            <p><strong>Sub Region:</strong> ${c.subregion || ''}</p>
            <p><strong>Capital:</strong> ${c.capital || ''}</p>
          </div>
          <div class="col">
            <p><strong>Top Level Domain:</strong> ${(c.topLevelDomain||[]).join(', ')}</p>
            <p><strong>Currencies:</strong> ${(c.currencies||[]).map(x=>x.name).join(', ')}</p>
            <p><strong>Languages:</strong> ${(c.languages||[]).map(x=>x.name).join(', ')}</p>
          </div>
        </div>
        <div class="borders"><strong>Border Countries:</strong> <div id="borders" class="borders-list"></div></div>
      </div>
    </div>
  `;

  const bordersEl = detailBody.querySelector('#borders');
  bordersEl.innerHTML = '';
  if(c.borders && c.borders.length){
    c.borders.forEach(code => {
      const match = countries.find(cc => cc.alpha3Code === code);
      const name = match ? match.name : code;
      const b = document.createElement('button');
      b.className = 'border-btn';
      b.textContent = name;
      b.dataset.code = code;
      b.addEventListener('click', () => showDetail(code));
      bordersEl.appendChild(b);
    });
  } else {
    bordersEl.textContent = 'None';
  }

  detailOverlay.classList.remove('hidden');
}

closeDetail.addEventListener('click', ()=> detailOverlay.classList.add('hidden'));

autoSearch();

function autoSearch(){
  searchInput.addEventListener('input', ()=>{
    const q = searchInput.value.trim().toLowerCase();
    const region = regionSelect.value;
    const filtered = countries.filter(c=>{
      const matchQ = !q || c.name.toLowerCase().includes(q);
      const matchR = !region || c.region === region;
      return matchQ && matchR;
    });
    renderCountries(filtered);
  });

  regionSelect.addEventListener('change', ()=>{
    const q = searchInput.value.trim().toLowerCase();
    const region = regionSelect.value;
    const filtered = countries.filter(c=>{
      const matchQ = !q || c.name.toLowerCase().includes(q);
      const matchR = !region || c.region === region;
      return matchQ && matchR;
    });
    renderCountries(filtered);
  });
}

// initial
fetchCountries();

// basic keyboard accessibility: Enter on card opens detail
countriesEl?.addEventListener('keydown', (e)=>{
  if(e.key === 'Enter' && e.target.closest('.card')){
    e.target.closest('.card').click();
  }
});
