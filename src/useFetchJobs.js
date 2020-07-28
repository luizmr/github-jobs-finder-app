import React, { useReducer, useEffect } from "react";
import axios from "axios";

// actions that can occur when getting data
const ACTIONS = {
	MAKE_REQUEST: "make-request",
	GET_DATA: "get-data",
	ERROR: "error",
	UPDATE_HAS_NEXT_PAGE: "update-has-next-page",
};

const BASE_URL =
	"https://cors-anywhere.herokuapp.com/https://jobs.github.com/positions.json";

function reducer(state, action) {
	// this function is called when dispatch is called
	switch (action.type) {
		// for each action, it returns a state
		case ACTIONS.MAKE_REQUEST:
			return { loading: true, jobs: [] };

		case ACTIONS.GET_DATA:
			return { ...state, loading: false, jobs: action.payload.jobs };

		case ACTIONS.ERROR:
			return {
				...state,
				loading: false,
				error: action.payload.error,
				jobs: [],
			};
		case ACTIONS.UPDATE_HAS_NEXT_PAGE:
			return { ...state, hasNextPage: action.payload.hasNextPage };

		default:
			return state;
	}
}

export default function useFetchJobs(params, page) {
	const [state, dispatch] = useReducer(reducer, { jobs: [], loading: true });

	// will be called when params or page changes
	useEffect(() => {
		// token for making axios cancelling request every time user types a new character

		const cancelToken1 = axios.CancelToken.source();
		// set the state for this action
		dispatch({ type: ACTIONS.MAKE_REQUEST });
		// making the request
		axios
			.get(BASE_URL, {
				cancelToken: cancelToken1.token,
				params: { markdown: true, page: page, ...params },
			})
			.then((res) => {
				console.log(res.data);
				dispatch({
					type: ACTIONS.GET_DATA,
					payload: { jobs: res.data },
				});
			})
			.catch((e) => {
				if (axios.isCancel(e)) return;
				// just check erros that is not because of cancelling
				dispatch({ type: ACTIONS.ERROR, payload: { error: e } });
			});

		// axios for next page to know if this will be successful
		const cancelToken2 = axios.CancelToken.source();
		axios
			.get(BASE_URL, {
				cancelToken: cancelToken2.token,
				params: { markdown: true, page: page + 1, ...params },
			}) // page + 1 -> next page
			.then((res) => {
				console.log(res.data);
				dispatch({
					type: ACTIONS.UPDATE_HAS_NEXT_PAGE,
					payload: { hasNextPage: res.data.length !== 0 },
				});
			})
			.catch((e) => {
				if (axios.isCancel(e)) return;
				// just check erros that is not because of cancelling
				dispatch({ type: ACTIONS.ERROR, payload: { error: e } });
			});

		// cancels token for every character typed
		return () => {
			cancelToken1.cancel();
			cancelToken2.cancel();
		};
	}, [params, page]);
	return state;
}
