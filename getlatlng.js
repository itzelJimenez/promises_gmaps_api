const props = require('./props_location.json')
const fs = require('fs')
const request = require('request');
const ubication = []

const iterateProps = () =>{
	props.map((el)=> {
		geopoints = {
			lat: el.lat,
			lng: el.lng
		}

		let promise = new Promise(function(resolve, reject){
			let api_path = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${el.lat},${el.lng}&key=AIzaSyAqFKrlfaFfOXhZ2XBC1_YT3Da6LuuNQmw`
			resolve(api_path)
		})

		promise.then((api_path)=>{
			let req = new Promise(function(resolve, reject){
				let state = null
		        setTimeout(()=>{
		        	request(api_path, (error, response, body) => {
			            if (!error && response.statusCode == 200) {
					      var info = JSON.parse(body)
					      let status = info.status
					      let results = info.results
					      if (status == "OK"){
					      	let address_components = results[0].address_components
						      for (obj in address_components){
						      	if (address_components[obj].types[0] == 'administrative_area_level_1') {
						      		let state = address_components[obj].long_name		
						      		resolve(state)					      		
						      	}
						      }
					      } else {
					      	let state = status	
						    resolve(state)
					      }
					    } else {
					    	console.log(el.prop)
					    	console.log(error)
					    	throw new Error(error);
					    }
		       		});
		        }, 5000)
			})

			req.then((x)=>{
				let locationlatlng = {
					prop: el.prop,
					state_base_datos: el.state,
					state_response_google: x,
					lat: el.lat,
					lng: el.lng
				}
				ubication.push(locationlatlng)
			}).then(()=>{
				fs.writeFile ("maps.json", JSON.stringify(ubication), function(err) {
				    if (err) throw err;
				    console.log('writing json');
				});
			})	

		})
			
	})
}

iterateProps()



