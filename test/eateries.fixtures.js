function makeEateriesArray() {
    return [
        {
            id: 1,
            name: 'Eatery 1',
            phone: '720-549-2910',
            address: '1223 Rainbow Ave, La Mesa, CA 92114',
            notes: 'Open late on weekends'

        },
        {
            id: 2,
            name: 'Eatery 2',
            phone: '800-230-2891',
            address: '209 A Street, Ste B, San Diego, CA 92105',
            notes: 'Open every day of the week 9-9 pm'
        },
        {
            id: 3,
            name: 'Eatery 3',
            phone: '619-350-3289',
            address: '999 80th Street, San Diego, CA 92108',
            notes: 'Open Mondays, Wednesdays, Fridays from 11 am - 11 pm'
        },
    ];
}

function makeEateriesNoId() {
    return [
        {
            name: 'Eatery 1',
            phone: '800-888-8900',
            address: '800 Eight Street, San Diego, CA 92126',
            notes: 'Open Monday - Saturday 8 am - 9 pm'
        },
        {
            name: 'Eatery 2',
            phone: '210-320-2904',
            address: '200 Shine Avenue, Ramona, CA 92065',
            notes: 'Open Friday and weekends 7 am - 10 pm'
        },
        {
            name: 'Eatery 3',
            phone: '858-234-2380',
            address: '100 North Face Street, San Diego, CA 92117',
            notes: 'Open Tuesdays, Thursdays, and Saturdays 10 am - 10 pm'
        },
    ];
}

module.exports = {
    makeEateriesArray,
    makeEateriesNoId
}
