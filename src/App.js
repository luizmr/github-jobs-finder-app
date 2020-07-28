import React, { useState } from "react";
import useFetchJobs from "./useFetchJobs";
import { Container } from "react-bootstrap";
import Job from "./Job";
import "./App.css";
import JobsPagination from "./JobsPagination";
import SearchForm from "./SearchForm";

function App() {
	// state created to pass to usefetchjobs make requests
	const [params, setParams] = useState({});
	const [page, setPage] = useState(1);
	// get these data from usefetchjobs and pass to children
	const { jobs, loading, error, hasNextPage } = useFetchJobs(params, page);

	function handleParamChange(e) {
		const param = e.target.name;
		const value = e.target.value;
		console.log(param);
		console.log(value);
		setPage(1);
		setParams((prevParams) => {
			return { ...prevParams, [param]: value };
		});
	}

	return (
		<Container className="my-4">
			<h1 className="mb-4">Gihub Jobs Finder</h1>
			<SearchForm params={params} onParamChange={handleParamChange} />
			<JobsPagination
				page={page}
				setPage={setPage}
				hasNextPage={hasNextPage}
			/>
			{loading && <h1>Loading...</h1>}
			{error && <h1>Error. Try Refreshing.</h1>}
			{jobs.map((job) => {
				return <Job key={job.id} job={job} />;
			})}
			<JobsPagination
				page={page}
				setPage={setPage}
				hasNextPage={hasNextPage}
			/>
		</Container>
	);
}

export default App;
