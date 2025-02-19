export interface Weather {
    location: {
        name: string,
        country: number,
        localtime: string
    },
    current: {
        temp_c: number;
        condition: {
            text: string;
            code: number
        };
        wind_kph: number,
        humidity: number
    },
    forecast: {
        forecastday: [
            {
                date: string,
                day: {
                    avgtemp_c: number,
                    condition: {
                        text: string
                    }
                },
                hour: [
                    {
                        time: string,
                        temp_c: number;
                        condition: {
                            text: string;
                        };
                    }
                ]
            }
        ]
    }
}

export interface Location {
    name: string;
    country: string;
}
