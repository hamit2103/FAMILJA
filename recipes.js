import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./app-config.js";

const ADMIN_EMAIL="admin@familja.local";
const ADMIN_ONLY=document.querySelector('meta[name="diamond-mode"]')?.content==="admin";
const supabase=createClient(SUPABASE_URL,SUPABASE_ANON_KEY,{auth:{persistSession:true,autoRefreshToken:true,storageKey:ADMIN_ONLY?"diamond-admin-auth":"diamond-family-auth"}});
const root=document.getElementById("recipesRoot"), LANG="pajaziti-language", FAV="diamond-recipe-favorites";
const T={
 sq:{tab:"Receta",title:"Gatime / Receta",sub:"Zgjidh kuzhinën dhe gjej recetën.",xk:"Receta Kosovare",tr:"Türk Yemekleri",search:"Kërko recetë...",all:"Të gjitha",fav:"Të preferuarat",ing:"Përbërësit",steps:"Përgatitja",people:"persona",min:"min",video:"Shiko videon",back:"← Recetat",empty:"Nuk ka receta këtu.",add:"Shto recetë",save:"Ruaj recetën",del:"Fshi",saved:"Receta u ruajt.",fail:"Nuk u ruajt receta.",meat:"Mish",soup:"Supa",dough:"Brumëra",dessert:"Ëmbëlsira",breakfast:"Mëngjes",other:"Tjera"},
 tr:{tab:"Tarifler",title:"Yemekler / Tarifler",sub:"Mutfağı seç ve tarifi bul.",xk:"Kosova Tarifleri",tr:"Türk Yemekleri",search:"Tarif ara...",all:"Tümü",fav:"Favoriler",ing:"Malzemeler",steps:"Hazırlanışı",people:"kişi",min:"dk",video:"Videoyu izle",back:"← Tarifler",empty:"Burada tarif yok.",add:"Tarif ekle",save:"Tarifi kaydet",del:"Sil",saved:"Tarif kaydedildi.",fail:"Tarif kaydedilemedi.",meat:"Et",soup:"Çorba",dough:"Hamur işleri",dessert:"Tatlı",breakfast:"Kahvaltı",other:"Diğer"},
 de:{tab:"Rezepte",title:"Kochen / Rezepte",sub:"Küche wählen und Rezept finden.",xk:"Kosovarische Rezepte",tr:"Türkische Rezepte",search:"Rezept suchen...",all:"Alle",fav:"Favoriten",ing:"Zutaten",steps:"Zubereitung",people:"Personen",min:"Min.",video:"Video ansehen",back:"← Rezepte",empty:"Keine Rezepte hier.",add:"Rezept hinzufügen",save:"Rezept speichern",del:"Löschen",saved:"Rezept gespeichert.",fail:"Speichern fehlgeschlagen.",meat:"Fleisch",soup:"Suppen",dough:"Teigwaren",dessert:"Desserts",breakfast:"Frühstück",other:"Andere"},
 en:{tab:"Recipes",title:"Cooking / Recipes",sub:"Choose a cuisine and find a recipe.",xk:"Kosovar Recipes",tr:"Turkish Recipes",search:"Search recipes...",all:"All",fav:"Favorites",ing:"Ingredients",steps:"Preparation",people:"servings",min:"min",video:"Watch video",back:"← Recipes",empty:"No recipes here.",add:"Add recipe",save:"Save recipe",del:"Delete",saved:"Recipe saved.",fail:"Save failed.",meat:"Meat",soup:"Soups",dough:"Dough",dessert:"Desserts",breakfast:"Breakfast",other:"Other"}
};
const lang=()=>{const l=localStorage.getItem(LANG)||"sq";return T[l]?l:"en"}, t=k=>T[lang()][k]||k;
const esc=(v="")=>String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const cat=c=>t(["meat","soup","dough","dessert","breakfast"].includes(c)?c:"other");
const favs=()=>{try{return new Set(JSON.parse(localStorage.getItem(FAV)||"[]").map(Number))}catch{return new Set()}};
const saveFavs=s=>localStorage.setItem(FAV,JSON.stringify([...s]));
let user=null,items=[],country=null,detail=null,query="",category="all",onlyFav=false,channel=null;
const isAdmin=()=>user?.email===ADMIN_EMAIL;

function card(r){const f=favs().has(Number(r.id));return `<article class="recipe-card" data-recipe="${r.id}">
  ${r.image_url?`<img src="${esc(r.image_url)}" alt="" loading="lazy">`:`<div class="recipe-photo-fallback">${r.country_group==="tr"?"🇹🇷":"🇽🇰"} 🍽️</div>`}
  <div class="recipe-card-body"><div class="recipe-card-title"><strong>${esc(r.title)}</strong><button type="button" data-fav="${r.id}" class="${f?"active":""}">${f?"★":"☆"}</button></div>
  <small>${esc(cat(r.category))}${r.cook_minutes?` · ${r.cook_minutes} ${t("min")}`:""}${r.servings?` · ${r.servings} ${t("people")}`:""}</small>
  ${r.description?`<p>${esc(r.description)}</p>`:""}</div></article>`}

function adminForm(){return `<section class="card recipe-admin"><h3>⚙️ ${t("add")}</h3>
<input id="rcTitle" placeholder="${t("add")}">
<div class="recipe-two"><select id="rcCountry"><option value="xk">🇽🇰 ${t("xk")}</option><option value="tr">🇹🇷 ${t("tr")}</option></select>
<select id="rcCat"><option value="meat">${t("meat")}</option><option value="soup">${t("soup")}</option><option value="dough">${t("dough")}</option><option value="dessert">${t("dessert")}</option><option value="breakfast">${t("breakfast")}</option><option value="other">${t("other")}</option></select></div>
<textarea id="rcDesc" rows="2" placeholder="Përshkrimi / Açıklama"></textarea>
<textarea id="rcIng" rows="5" placeholder="${t("ing")} — një për rresht"></textarea>
<textarea id="rcSteps" rows="5" placeholder="${t("steps")} — një për rresht"></textarea>
<div class="recipe-two"><input id="rcServ" type="number" min="1" max="50" placeholder="${t("people")}"><input id="rcMin" type="number" min="1" max="1440" placeholder="${t("min")}"></div>
<input id="rcImage" type="url" placeholder="https://... foto (opsionale)"><input id="rcVideo" type="url" placeholder="https://... video (opsionale)">
<button id="rcSave" class="primary" type="button">${t("save")}</button><div id="rcStatus" class="message"></div></section>`}

function home(){country=null;detail=null;root.innerHTML=`<div class="recipes-shell"><section class="recipes-hero"><span>🍳</span><div><h2>${t("title")}</h2><p>${t("sub")}</p></div></section>
<div class="recipe-country-grid"><button data-country="xk"><span>🇽🇰</span><strong>${t("xk")}</strong><small>${items.filter(x=>x.country_group==="xk").length} receta</small></button>
<button data-country="tr"><span>🇹🇷</span><strong>${t("tr")}</strong><small>${items.filter(x=>x.country_group==="tr").length} receta</small></button></div>
${isAdmin()?adminForm():""}</div>`;
root.querySelectorAll("[data-country]").forEach(b=>b.onclick=()=>{country=b.dataset.country;list()});document.getElementById("rcSave")?.addEventListener("click",add)}

function list(){let a=items.filter(x=>x.country_group===country);if(query)a=a.filter(x=>(x.title+" "+x.description+" "+(x.ingredients||[]).join(" ")).toLowerCase().includes(query.toLowerCase()));if(category!=="all")a=a.filter(x=>x.category===category);if(onlyFav){const f=favs();a=a.filter(x=>f.has(Number(x.id)))}
const cats=["all","meat","soup","dough","dessert","breakfast","other"];
root.innerHTML=`<div class="recipes-shell"><div class="recipe-list-head"><button id="rcBack" class="secondary">${t("back")}</button><h2>${country==="tr"?"🇹🇷 "+t("tr"):"🇽🇰 "+t("xk")}</h2></div>
<div class="recipe-search"><input id="rcSearch" value="${esc(query)}" placeholder="${t("search")}"><button id="rcFavFilter" class="secondary ${onlyFav?"active":""}">★ ${t("fav")}</button></div>
<div class="recipe-cats">${cats.map(c=>`<button data-cat="${c}" class="${category===c?"active":""}">${c==="all"?t("all"):cat(c)}</button>`).join("")}</div>
<div class="recipe-grid">${a.length?a.map(card).join(""):`<div class="card empty">${t("empty")}</div>`}</div></div>`;
document.getElementById("rcBack").onclick=home;document.getElementById("rcSearch").oninput=e=>{query=e.target.value;list()};document.getElementById("rcFavFilter").onclick=()=>{onlyFav=!onlyFav;list()};
root.querySelectorAll("[data-cat]").forEach(b=>b.onclick=()=>{category=b.dataset.cat;list()});root.querySelectorAll("[data-recipe]").forEach(b=>b.onclick=e=>{if(e.target.closest("[data-fav]"))return;detail=Number(b.dataset.recipe);showDetail()});
root.querySelectorAll("[data-fav]").forEach(b=>b.onclick=()=>{const id=Number(b.dataset.fav),f=favs();f.has(id)?f.delete(id):f.add(id);saveFavs(f);list()})}

function showDetail(){const r=items.find(x=>Number(x.id)===detail);if(!r)return list();root.innerHTML=`<div class="recipes-shell"><button id="rcDetailBack" class="secondary">← ${country==="tr"?t("tr"):t("xk")}</button><article class="card recipe-detail">
${r.image_url?`<img src="${esc(r.image_url)}" alt="" loading="lazy">`:`<div class="recipe-detail-fallback">${country==="tr"?"🇹🇷":"🇽🇰"} 🍽️</div>`}<h2>${esc(r.title)}</h2>
<div class="recipe-meta">${r.servings?`<span>👥 ${r.servings} ${t("people")}</span>`:""}${r.cook_minutes?`<span>⏱️ ${r.cook_minutes} ${t("min")}</span>`:""}</div>
${r.description?`<p>${esc(r.description)}</p>`:""}<h3>🧺 ${t("ing")}</h3><ul>${(r.ingredients||[]).map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
<h3>👩‍🍳 ${t("steps")}</h3><ol>${(r.steps||[]).map(x=>`<li>${esc(x)}</li>`).join("")}</ol>
${r.video_url?`<a class="primary recipe-video" href="${esc(r.video_url)}" target="_blank" rel="noopener">▶ ${t("video")}</a>`:""}${isAdmin()?`<button id="rcDelete" class="recipe-delete">🗑️ ${t("del")}</button>`:""}</article></div>`;
document.getElementById("rcDetailBack").onclick=list;document.getElementById("rcDelete")?.addEventListener("click",()=>remove(r.id))}

async function add(){const title=document.getElementById("rcTitle")?.value.trim();if(!title)return;const lines=id=>(document.getElementById(id)?.value||"").split("\n").map(x=>x.trim()).filter(Boolean);
const payload={title,country_group:document.getElementById("rcCountry").value,category:document.getElementById("rcCat").value,description:document.getElementById("rcDesc").value.trim(),ingredients:lines("rcIng"),steps:lines("rcSteps"),servings:Number(document.getElementById("rcServ").value)||null,cook_minutes:Number(document.getElementById("rcMin").value)||null,image_url:document.getElementById("rcImage").value.trim()||null,video_url:document.getElementById("rcVideo").value.trim()||null,created_by:user?.id||null,updated_at:new Date().toISOString()};
const {error}=await supabase.from("recipes").insert(payload);const s=document.getElementById("rcStatus");if(s)s.textContent=error?t("fail"):t("saved");if(!error)await load()}
async function remove(id){if(!isAdmin())return;const {error}=await supabase.from("recipes").delete().eq("id",id);if(!error){detail=null;await load();list()}}
async function load(){const {data,error}=await supabase.from("recipes").select("*").order("created_at",{ascending:true});if(!error)items=data||[];if(detail)showDetail();else if(country)list();else home()}
function realtime(){if(channel)return;channel=supabase.channel("recipes-live").on("postgres_changes",{event:"*",schema:"public",table:"recipes"},load).subscribe()}
async function activate(){if(!root)return;const {data}=await supabase.auth.getSession();user=data.session?.user||null;await load();realtime();reloadLanguage()}
function reloadLanguage(){const l=document.getElementById("recipesTabLabel");if(l)l.textContent=t("tab");if(root?.children.length){if(detail)showDetail();else if(country)list();else home()}}
window.DiamondRecipes={activate,reloadLanguage};
