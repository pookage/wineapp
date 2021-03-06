import React, { createContext, useReducer, useEffect, useContext } from "react";
import { placeholder__wines, fetchWines, fetchWineDetails } from "SHARED/data.js";
import { getUrlParams } from "SHARED/utils.js";
import * as ACTIONS from "SHARED/actions.js";

const Wine         = createContext();
const initialState = {
	activeWine: {
		id: "",
		details: {}
	},
	wines: [],
	filters: {
		color: getUrlParams("color")[0] || "red",
		advanced: []
	}
};

function reducer(state, action){

	const {
		type,
		value
	} = action;

	switch(type){
		case ACTIONS.UPDATE_WINES:
			return {
				...state,
				wines: value
			};

		case ACTIONS.FILTER_BY_COLOR:
			return {
				...state,
				filters: {
					advanced: state.filters.advanced,
					color: value
				}
			};

		case ACTIONS.SET_ACTIVE_WINE:
			//only update the active wine if it's different from the current one
			if(value != state.activeWine.id){
				return {
					...state,
					activeWine: {
						id: value,
						details: {}
					}
				};
			} else return { ...state  };

		case ACTIONS.SET_ACTIVE_WINE_DETAILS:
			return {
				...state,
				activeWine: {
					id: state.activeWine.id,
					details: value
				}
			};

		default:
			console.error(`Action: ${type} does not exist in the <Wine> context.`);
			return { ...state };
	}

}//reducer

function WineProvider(props){

	//HOOKS
	//----------------------
	const [ state, dispatch ]     = useReducer(reducer, initialState);
	const { filters, activeWine } = state;

	useEffect(syncWinesByColorFilter, [ filters.color ]);
	useEffect(syncWineDetails, [ activeWine.id ]);


	//EFFECT HANDLING
	//----------------------
	function syncWinesByColorFilter(){

		if(filters.color){
			updateWineList({ 
				filters: {
					wine_color: filters.color,
				},
				limit: 25
			});
		}
	}//syncWinesByColorFilter
	function syncWineDetails(){
		if(activeWine.id){
			updateWineDetails(activeWine.id);	
		}
	}//syncWineDetails


	//UTILS
	//---------------------
	async function updateWineList(parameters){
		const result = await fetchWines(parameters);
		dispatch({ 
			type: ACTIONS.UPDATE_WINES,
			value: result
		});
	}//updateWineList
	async function updateWineDetails(id){
		const details = await fetchWineDetails(id);
		dispatch({
			type: ACTIONS.SET_ACTIVE_WINE_DETAILS,
			value: details
		});
	}//updateWineDetails

	

	//PRIVATE VARS
	//----------------------
	const { children } = props;

	return(
		<Wine.Provider
			value={{ state, dispatch }}>
			{children}
		</Wine.Provider>
	);
}//WineProvider


export {
	Wine,
	WineProvider
};