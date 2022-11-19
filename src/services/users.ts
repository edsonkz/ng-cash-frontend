import axios from "axios";
const baseUrl = "http:localhost:3333/users";

const findOne = (id: string) => {
	return axios.get(`${baseUrl}/${id}`);
};

const create = (newUser: Object) => {
	return axios.post(baseUrl, newUser);
};

export default {
	findOne,
	create,
};
