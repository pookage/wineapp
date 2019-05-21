import React, { useContext } from "react";
import { getAssetUrl } from "SHARED/utils.js";
import { Wine } from "CONTEXTS/Wine.jsx";

export default function WineDetails(props){


	/* NOTE:
	------------------------------------
	
		You'll need to change the order of the header-items with
		flex to maintain the correct semantic order whilst adopting
		the correct styles

	*/

	//HOOKS
	//-------------------------
	const { state, dispatch } = useContext(Wine);
	const { details, id }     = state.activeWine;

	if(Object.values(details).length > 0){

		//PRIVATE VARS
		//--------------------------
		console.warn("TODO: refactor using under_score naming convention instead of camelCase");
		const {
			name: wineName = "",
			producer       = {},
			price          = {},
			media          = [],
			categories     = [],
			rebuy_rating,
			year,
			quantity,
			measure,
			strength,
			food_matching  = "",
			tasting_note   = ""
		} = state.activeWine.details;

		const {
			name: producerName = "",
			about: about_winemaker
		} = producer;

		const {
			actual,
			original,
			currency
		} = price;

		const {
			public_id
		} = media[0];

		const headerImageSrc = getAssetUrl(public_id, { w: 1024 });

		//PRICING
		console.warn("TODO : create a client provider to put regional currency stuff into");
		//NOTE : this is repeated - might be worth putting some of this in a <Client> provider
		const currencySystem   = new Intl.NumberFormat(navigator.language, { style: "currency", currency });
		const price_original   = currencySystem.format(original);
		const price_discounted = currencySystem.format(actual);
		const discount         = Math.floor((1 - (actual / original)) * 100);


		//TAGS
		console.warn("TODO: move render maps into their own named functions");
		const flavourTags = categories.filter(category => category.type == "primary_flavor");
		const foodTags    = categories.filter(category => category.type == "food_category");
		const miscTags    = categories.filter(category => category.type != "food_category" && category.type != "primary_flavor");

		return(
			<article>
				<header>
					<div>
						<h2>
							{producerName}
						</h2>
						<h1>
							{name}
						</h1>
						<p aria-label="Current price.">
							{price_discounted}
						</p>
						<p aria-label="Previous price.">
							{price_original}
						</p>
					</div>
					<div>
						<img src={headerImageSrc} alt={`${wineName} by ${producerName}`} />
						<aside>
							<p>
								{rebuy_rating}% would rebuy
							</p>
							<p>
								{discount}% off
							</p>
						</aside>
					</div>
				</header>
				
				<section>
					<h1>
						About this wine
					</h1>
					<dl>
						<div>
							<dt>Year</dt>
							<dd>{year}</dd>
						</div>
						<div>
							<dt>Size</dt>
							<dd>{quantity}{measure}</dd>
						</div>
						<div>
							<dt>
								<abbr title="Alchol by Volume">ABV</abbr>
							</dt>
							<dd>{strength}%</dd>
						</div>
					</dl>

					<ul aria-label="Related tags.">
						{miscTags.map(tag => (
							<li>
								{tag.name}
							</li>
						))}
					</ul>
				</section>

				<section>
					<h1>
						Flavours
					</h1>
					<p>
						{tasting_note}
					</p>

					<ul aria-label="Flavours.">
						{flavourTags.map(tag => (
							<li>
								{tag.name}
							</li>
						))}
					</ul>
				</section>

				<section>
					<h1>
						Food Pairing
					</h1>
					<p>
						{food_matching}
					</p>

					<ul aria-label="Good food pairings.">
						{foodTags.map(tag => (
							<li>
								{tag.name}
							</li>
						))}
					</ul>
				</section>

				<section>
					<h1>
						About the Winemaker
					</h1>
					<p>
						{about_winemaker}
					</p>
					<a href="">
						See more wines from here
					</a>
				</section>

				<aside>
					<h1>
						You may also like
					</h1>
					<ol>
						<li>~~look in the endpoints to see if there's any 'recommended_wines' section~~</li>
					</ol>
				</aside>

			</article>
		);
	} else {
		return (
			<p>
				No Wine Selected
			</p>
		);
	}
}//WineDetails