import { docs, loadDocsPage } from "./fetch.js";
HTMLCollection.prototype.forEach = Array.prototype.forEach;

const $cardsDiv = document.querySelector("#cards");
const $searchBox = document.getElementById("search-box");
const $searchButton = document.getElementById("search-button");
const $modalInneer = document.querySelector("#modal-inneer");
const $pageLinkButton = document.getElementsByClassName("page-link");

const maxCardNumberInPage = 20;
const maxPaginationButtonNumber = 5;
const maxOverviewStringLength = 180;

let pageNumber = 1;

function makeCards(searchText)
{
	$cardsDiv.innerHTML = "";
	//searchText = searchText.toLowerCase();

	let cardCount = 0;

	for (let i = searchText == "" ? (pageNumber - 1) * maxCardNumberInPage : 0; i < docs.length; i++)
	{
		if (docs[i]['title'].toLowerCase().indexOf(searchText) !== -1 || searchText === "")
		{
			let tempOverview = docs[i].overview.slice(0, maxOverviewStringLength);

			if (tempOverview.length >= maxOverviewStringLength - 1)
				tempOverview += "...";

			let temp_html = `
				<div class="col">
					<div id="${docs[i].movieId}" class="card h-100 main-card" data-bs-toggle="modal" data-bs-target="#infoModal">
						<img src="${docs[i].backdropImage}" class="card-img-top" alt="...">
						<div class="card-body">
							<h3 class="card-title">${docs[i].title}</h3>
							<p class="card-text">${tempOverview}</p>
						</div>
						<div class="card-footer">
							<small class="text-body-secondary">평점 : ${docs[i].voteAverage}</small>
						</div>
					</div>
				</div>
				`;

			$cardsDiv.insertAdjacentHTML("beforeend", temp_html);

			const $card = document.getElementById(docs[i].movieId);
			$card.addEventListener('click', (event) =>
			{
				event.preventDefault();
				clickedCard($card.id);
			})

			cardCount++;
		}

		if (cardCount >= maxCardNumberInPage)
			break;
	}
}

function clickedCard(movieId)
{
	$modalInneer.innerHTML = "";

	let idx = docs.findIndex((doc) => { return doc['movieId'] == movieId; });

	let temp_html = `
		<div class="row row-cols-1 row-cols-xl-2">
			<div class="col p-4 text-center poster-box">
				<img src="${docs[idx]['posterImage']}" alt="">
			</div>
			<div class="col p-4">
				<h1>${docs[idx]['title']}</h1>
				<h5>${docs[idx]['originalTitle']}</h5>
				<br>
				<p>개봉 일자 : ${docs[idx]['releaseDate']}</p>
				<p>영화 ID : ${docs[idx]['movieId']}</p>
				<p>평균 평점 : ${docs[idx]['voteAverage']}</p>
				<p>평점 수 : ${docs[idx]['voteCount']}</p>
				<p>줄거리 : <br>&emsp;${docs[idx]['overview']}</p>
			</div>
		</div>
		`;

	$modalInneer.insertAdjacentHTML("beforeend", temp_html);
}

function inputEvent() { makeCards($searchBox.value); }

function loadPaginationButtonState()
{
	$pageLinkButton.forEach((btn) =>
	{
		btn.className = 'page-link';
		if (btn.innerHTML == pageNumber)
			btn.className += ' active';
		else if (parseInt($pageLinkButton[1].innerHTML) - maxPaginationButtonNumber <= 0 && btn.innerHTML == "이전")
			btn.className += ' disabled';
		else if (parseInt($pageLinkButton[1].innerHTML) + maxPaginationButtonNumber >= loadDocsPage && btn.innerHTML == "다음")
			btn.className += ' disabled';
	});
}

function addEventListeners()
{
	$searchBox.addEventListener('keyup', (event) =>
	{
		event.preventDefault();
		inputEvent();
	})

	$searchButton.addEventListener('click', (event) =>
	{
		event.preventDefault();
		inputEvent();
	})

	$pageLinkButton.forEach((button) =>
	{
		button.addEventListener('click', (event) =>
		{
			event.preventDefault();

			if (button.innerHTML == "이전")
			{
				$pageLinkButton.forEach((btn) =>
				{
					if (btn.innerHTML != "이전" && btn.innerHTML != "다음")
						btn.innerHTML = parseInt(btn.innerHTML) - maxPaginationButtonNumber;
				});
				pageNumber = $pageLinkButton[5].innerHTML;
			}
			else if (button.innerHTML == "다음")
			{
				$pageLinkButton.forEach((btn) =>
				{
					if (btn.innerHTML != "이전" && btn.innerHTML != "다음")
						btn.innerHTML = parseInt(btn.innerHTML) + maxPaginationButtonNumber;
				});
				pageNumber = $pageLinkButton[1].innerHTML;
			}
			else
				pageNumber = button.innerHTML;

			loadPaginationButtonState();
			makeCards("");
		});
	});
}

export { makeCards, loadPaginationButtonState, addEventListeners };