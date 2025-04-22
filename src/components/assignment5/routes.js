import React from "react";


function Routes(props){
    const {projection, routes, selectedAirlineID} = props;
    // TODO: 
    // return the routes of the selected airline; 
    // If the selectedAirlineID is null (i.e., no airline is selected), return <g></g>.
    console.log("Selected Airline ID:", selectedAirlineID);

    if (!selectedAirlineID) {
        console.log("No airline selected, returning empty <g>.");
        return <g />;
    }
    const filteredRoutes = routes.filter(route => route.AirlineID === selectedAirlineID);
    
    return (
        <g>
            {filteredRoutes.map(route => {
                console.log("Processing Route ID:", route.ID);
                console.log("Source Coordinates:", [route.SourceLongitude, route.SourceLatitude]);
                console.log("Destination Coordinates:", [route.DestLongitude, route.DestLatitude]);


                const [x1, y1] = projection([route.SourceLongitude, route.SourceLatitude]);
                const [x2, y2] = projection([route.DestLongitude, route.DestLatitude]);
                console.log("Projected Source Coordinates:", [x1, y1]);
                console.log("Projected Destination Coordinates:", [x2, y2]);

                return (
                    <line
                        key={route.ID}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="#992a2a"
                        opacity={0.1}
                    />
                );
            })}
        </g>
    );
    
}

export { Routes }