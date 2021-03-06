import decode from "jwt-decode";

export default class ApiHelper {

    login = (email, password) => {
        // Get a token from api server using the fetch api
        return this.fetch(`http://localhost:3001/login`, {
            method: "POST",
            body: JSON.stringify({
                email,
                password
            })
        }).then(res => {
            this.setToken(res.token); // Setting the token in localStorage
            return Promise.resolve(res);
        });
    };

    signup = (user) => {
        // Get a token from api server using the fetch api
        return this.fetch(`http://localhost:3001/signup`, {
            method: "POST",
            body: JSON.stringify(user)
        }).then(res => {
            this.setToken(res.token); // Setting the token in localStorage
            return Promise.resolve(res);
        });
    };

    createLoan = (loan) => {
        var user = JSON.parse(localStorage.getItem('user'));
        return this.fetch(`http://localhost:3001/users/${user.id}/prestamos`, {
            method: "POST",
            body: JSON.stringify(loan)
        }).then(res => {
            return Promise.resolve(res);
        });
    }


    deleteLoan = (id) => {
        var user = JSON.parse(localStorage.getItem('user'));
        return this.fetch(`http://localhost:3001/users/${user.id}/prestamos/${id}`, {
            method: "DELETE"
        }).then(res => {
            console.log("APIE");
            console.log(res);
            return Promise.resolve(res);
        });
    }

    updateLoan = (loan) => {
        var user = JSON.parse(localStorage.getItem('user'));
        return this.fetch(`http://localhost:3001/users/${user.id}/prestamos/${loan.id}`, {
            method: "PUT",
            body: JSON.stringify(loan)
        }).then(res => {
            return Promise.resolve(res);
        });
    };

    getLoan = (id) => {
        var user = JSON.parse(localStorage.getItem('user'));
        return this.fetch(`http://localhost:3001/users/${user.id}/prestamos/${id}`, {
            method: "GET"
        }).then(res => {
            return Promise.resolve(res);
        });
    };

    getAllLoans = () => {
        var user = JSON.parse(localStorage.getItem('user'));
        return this.fetch(`http://localhost:3001/users/${user.id}/prestamos`, {
            method: "GET"
        }).then(res => {
            return Promise.resolve(res);
        });
    };

    createOffer = (loan) => {
        var user = JSON.parse(localStorage.getItem('user'));
        return this.fetch(`http://localhost:3001/users/${user.id}/ofertas`, {
            method: "POST",
            body: JSON.stringify(loan)
        }).then(res => {
            return Promise.resolve(res);
        });
    }


    deleteOffer = (id) => {
        var user = JSON.parse(localStorage.getItem('user'));
        return this.fetch(`http://localhost:3001/users/${user.id}/ofertas/${id}`, {
            method: "DELETE"
        }).then(res => {
            return Promise.resolve(res);
        });
    }

    updateOffer = (loan) => {
        var user = JSON.parse(localStorage.getItem('user'));
        return this.fetch(`http://localhost:3001/users/${user.id}/ofertas/${loan.id}`, {
            method: "PUT",
            body: JSON.stringify(loan)
        }).then(res => {
            return Promise.resolve(res);
        });
    };

    getOffer = (loan) => {
        var user = JSON.parse(localStorage.getItem('user'));
        return this.fetch(`http://localhost:3001/users/${user.id}/ofertas/${loan.id}`, {
            method: "GET"
        }).then(res => {
            return Promise.resolve(res);
        });
    };

    getAllOffers = () => {
        var user = JSON.parse(localStorage.getItem('user'));
        return this.fetch(`http://localhost:3001/users/${user.id}/ofertas`, {
            method: "GET"
        }).then(res => {
            return Promise.resolve(res);
        });
    };

    createObject = (object) => {
        var user = JSON.parse(localStorage.getItem('user'));
        return this.fetch(`http://localhost:3001/users/${user.id}/objetos`, {
            method: "POST",
            body: JSON.stringify(object)
        }).then(res => {
            return Promise.resolve(res);
        });
    };

    updateUser = (userID, user) => {
        var current_user = JSON.parse(localStorage.getItem('user'));
        console.log(current_user);
        for (var key in user) {
            if (user[key] === '') {
                delete user[key];
            } else if (user[key] !== undefined) {
                current_user[key] = user[key];
            }
        }
        localStorage.setItem("user", JSON.stringify(current_user));
        return this.fetch(`http://localhost:3001/users/${userID}`, {
            method: "PUT",
            body: JSON.stringify(user)
        }).then(res => {
            return Promise.resolve(res);
        });
    };

    loggedIn = () => {
        // Checks if there is a saved token and it's still valid
        const token = this.getToken(); // Getting token from localstorage
        return !!token && !this.isTokenExpired(token); // handwaiving here
    };

    isTokenExpired = token => {
        try {
            const decoded = decode(token);
            if (decoded.exp < Date.now() / 1000) {
                // Checking if token is expired.
                return true;
            } else return false;
        } catch (err) {
            console.log("expired check failed! Line 42: AuthService.js");
            return false;
        }
    };

    setToken = idToken => {
        // Saves user token to localStorage
        localStorage.setItem("id_token", idToken);
    };

    getToken = () => {
        // Retrieves the user token from localStorage
        return localStorage.getItem("id_token");
    };

    logout = () => {
        // Clear user token and profile data from localStorage
        localStorage.removeItem("id_token");
        localStorage.removeItem("user");
    };

    getConfirm = () => {
        // Using jwt-decode npm package to decode the token
        let answer = decode(this.getToken());
        return answer;
    };

    fetch = (url, options) => {
        // performs api calls sending the required authentication headers
        const headers = {
            Accept: "application/json",
            "Content-Type": "application/json"
        };
        // Setting Authorization header
        // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
        if (this.loggedIn()) {
            headers["Authorization"] = "Bearer " + this.getToken();
        }

        return fetch(url, {
            headers,
            ...options
        })
            .then(this._checkStatus)
            .then(response => response.json());
    };

    _checkStatus = response => {
        // raises an error in case response status is not a success
        if (response.status >= 200 && response.status < 300) {
            // Success status lies between 200 to 300
            return response;
        } else {
            var error = new Error(response.statusText);
            error.response = response;
            throw error;
        }
    };
}