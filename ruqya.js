const RUQYA_LANG_KEY="pajaziti-language";
const RQ={
sq:{title:"Shërim me Kuran",desc:"Ruqje me Kuran dhe dua sipas traditës islame.",open:"Hap ruqjen →",close:"Mbyll",back:"← Namazi",note:"Ruqja është lutje dhe adhurim. Për sëmundje fizike ose psikologjike vazhdo edhe kontrollin dhe trajtimin mjekësor; Kurani dhe dua nuk e zëvendësojnë mjekun.",items:[
["🤲 Sëmundje ose dhimbje","Lexo El-Fatiha, Ajetul Kursi, El-Ihlas, El-Felek dhe En-Nas. Për dhimbje vendos dorën në vendin e dhimbjes, thuaj “Bismilah” 3 herë, pastaj 7 herë: “Eudhu bi izzetil-lahi ue kudretihi min sherri ma exhidu ue uhadhir.”"],
["🫀 Frikë, ankth dhe shqetësim","Lexo Ajetul Kursi, El-Felek dhe En-Nas; bëj dhikër dhe dua. Në mbrëmje mund të lexosh dy ajetet e fundit të El-Bekares."],
["🌀 Vesvese","Kërko mbrojtje tek Allahu: “Eudhu bil-lahi mine-sh-shejtani-rraxhim”, lexo El-Felek dhe En-Nas dhe mos u angazho me mendimin e padëshiruar."],
["🧿 Sy i keq dhe zili","Lexo El-Fatiha, Ajetul Kursi, El-Ihlas, El-Felek dhe En-Nas. Ruqja bëhet pa hajmali, magji ose praktika të ndaluara."],
["🌙 Gjumë dhe ëndrra të këqija","Para gjumit lexo Ajetul Kursi dhe El-Ihlas, El-Felek, En-Nas; fry lehtë në duar dhe fërko trupin. Mund të lexosh edhe dy ajetet e fundit të El-Bekares."],
["🛡️ Mbrojtje e përgjithshme","Lexo dhikrin e mëngjesit dhe mbrëmjes, Ajetul Kursi dhe tre suret e fundit. Mbështetu tek Allahu dhe ruaj namazin."]
],dua:"Dua për shërim: Allahumme Rabben-nas, edhhibi-l-be's, ishfi ente-sh-Shafi, la shifae illa shifauk, shifaen la jugadiru sekamen."},
de:{title:"Heilung mit dem Koran",desc:"Ruqya mit Koran und Bittgebeten nach islamischer Überlieferung.",open:"Ruqya öffnen →",close:"Schließen",back:"← Gebet",note:"Ruqya ist Gebet und Gottesdienst. Bei körperlichen oder psychischen Erkrankungen medizinische Untersuchung und Behandlung fortsetzen; Koran und Dua ersetzen keine ärztliche Behandlung.",items:[
["🤲 Krankheit oder Schmerzen","Lies Al-Fatiha, Ayat al-Kursi, Al-Ikhlas, Al-Falaq und An-Nas. Bei Schmerzen die Hand auf die Stelle legen, 3-mal „Bismillah“ und anschließend 7-mal die überlieferte Schutz-Dua sprechen."],
["🫀 Angst und Unruhe","Ayat al-Kursi, Al-Falaq und An-Nas lesen, Dhikr und Dua machen. Abends können die letzten zwei Verse von Al-Baqara gelesen werden."],
["🌀 Waswasa","Schutz bei Allah suchen: „A'udhu billahi min ash-shaytan ir-rajim“, Al-Falaq und An-Nas lesen und unerwünschte Gedanken nicht weiterverfolgen."],
["🧿 Böses Auge und Neid","Al-Fatiha, Ayat al-Kursi, Al-Ikhlas, Al-Falaq und An-Nas lesen. Keine Amulette, Magie oder verbotene Praktiken verwenden."],
["🌙 Schlaf und Albträume","Vor dem Schlaf Ayat al-Kursi und die letzten drei Suren lesen, leicht in die Hände blasen und über den Körper streichen."],
["🛡️ Allgemeiner Schutz","Morgen- und Abendadhkar, Ayat al-Kursi und die letzten drei Suren lesen und das Gebet bewahren."]
],dua:"Dua zur Heilung: Allahumma Rabban-nas, adhhib al-ba's, ishfi anta-sh-Shafi, la shifaa illa shifauk, shifaan la yughadiru saqaman."},
tr:{title:"Kur'an ile Şifa",desc:"İslami rivayete göre Kur'an ve dualarla rukye.",open:"Rukyeyi aç →",close:"Kapat",back:"← Namaz",note:"Rukye dua ve ibadettir. Fiziksel veya psikolojik hastalıkta tıbbi muayene ve tedaviyi de sürdür; Kur'an ve dua doktor tedavisinin yerine geçmez.",items:[
["🤲 Hastalık veya ağrı","Fatiha, Ayetel Kürsi, İhlas, Felak ve Nas oku. Ağrı olan yere elini koyup 3 kez “Bismillah”, sonra rivayet edilen korunma duasını 7 kez söyle."],
["🫀 Korku ve kaygı","Ayetel Kürsi, Felak ve Nas oku; zikir ve dua et. Akşam Bakara'nın son iki ayeti okunabilir."],
["🌀 Vesvese","“Euzü billahi mineşşeytanirracim” diyerek Allah'a sığın, Felak ve Nas oku ve istenmeyen düşünceyi takip etme."],
["🧿 Nazar ve haset","Fatiha, Ayetel Kürsi, İhlas, Felak ve Nas oku. Muska, sihir veya haram uygulamalar kullanma."],
["🌙 Uyku ve kötü rüyalar","Uyumadan Ayetel Kürsi ile İhlas, Felak ve Nas oku; ellere hafifçe üfleyip bedene sür."],
["🛡️ Genel korunma","Sabah-akşam zikirlerini, Ayetel Kürsi'yi ve son üç sureyi oku; namazı koru."]
],dua:"Şifa duası: Allahümme Rabben-nâs, ezhibi'l-be's, işfi ente'ş-Şâfî, lâ şifâe illâ şifâuk, şifâen lâ yugâdiru sekamen."},
en:{title:"Healing with the Quran",desc:"Ruqyah with Quran and supplication from Islamic tradition.",open:"Open Ruqyah →",close:"Close",back:"← Prayer",note:"Ruqyah is prayer and worship. For physical or mental illness continue medical assessment and treatment; Quran and dua do not replace medical care.",items:[
["🤲 Illness or pain","Recite Al-Fatiha, Ayat al-Kursi, Al-Ikhlas, Al-Falaq and An-Nas. For pain place your hand on the painful area, say “Bismillah” 3 times, then the reported protection supplication 7 times."],
["🫀 Fear and anxiety","Recite Ayat al-Kursi, Al-Falaq and An-Nas, and make dhikr and dua. The last two verses of Al-Baqara may be read at night."],
["🌀 Waswasa","Seek refuge in Allah, recite Al-Falaq and An-Nas, and avoid engaging with unwanted intrusive thoughts."],
["🧿 Evil eye and envy","Recite Al-Fatiha, Ayat al-Kursi, Al-Ikhlas, Al-Falaq and An-Nas. Avoid amulets, magic or prohibited practices."],
["🌙 Sleep and nightmares","Before sleep recite Ayat al-Kursi and the last three surahs; lightly blow into the hands and wipe the body."],
["🛡️ General protection","Read morning/evening adhkar, Ayat al-Kursi and the last three surahs, and maintain the prayers."]
],dua:"Healing dua: Allahumma Rabban-nas, adhhib al-ba's, ishfi anta-sh-Shafi, la shifaa illa shifauk, shifaan la yughadiru saqaman."}
};
function rql(){const l=localStorage.getItem(RUQYA_LANG_KEY)||"sq";return RQ[l]?l:"en";}
function rqt(){return RQ[rql()]||RQ.en;}
function esc(v=""){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function updateRuqyaCard(){const t=rqt();const a=document.getElementById("ruqyaCardTitle"),b=document.getElementById("ruqyaCardDesc"),c=document.getElementById("ruqyaCardOpen");if(a)a.textContent=t.title;if(b)b.textContent=t.desc;if(c)c.textContent=t.open;}
function openRuqya(){const t=rqt(),p=document.getElementById("ruqyaPanel");if(!p)return;p.innerHTML=`<div class="prayer-guide-head"><button id="ruqyaBack" class="secondary" type="button">${esc(t.back)}</button><button id="ruqyaClose" class="secondary" type="button">${esc(t.close)}</button></div><h2>🌿 ${esc(t.title)}</h2><p class="muted">${esc(t.desc)}</p><div class="ruqya-list">${t.items.map(x=>`<article class="ruqya-item"><h3>${esc(x[0])}</h3><p>${esc(x[1])}</p></article>`).join("")}</div><section class="ruqya-dua"><strong>🤲 ${esc(t.dua)}</strong></section><p class="muted small">⚕️ ${esc(t.note)}</p>`;p.classList.remove("hidden");document.getElementById("ruqyaBack")?.addEventListener("click",closeRuqya);document.getElementById("ruqyaClose")?.addEventListener("click",closeRuqya);p.scrollIntoView({behavior:"smooth",block:"start"});}
function closeRuqya(){document.getElementById("ruqyaPanel")?.classList.add("hidden");}
function back(){const p=document.getElementById("ruqyaPanel");if(p&&!p.classList.contains("hidden")){closeRuqya();return true;}return false;}
function reloadLanguage(){updateRuqyaCard();const p=document.getElementById("ruqyaPanel");if(p&&!p.classList.contains("hidden"))openRuqya();}
document.getElementById("ruqyaCard")?.addEventListener("click",openRuqya);
updateRuqyaCard();
window.DiamondRuqya={open:openRuqya,close:closeRuqya,back,reloadLanguage};