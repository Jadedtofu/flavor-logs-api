function makeFlavorLogsArray() {
    return [
        {
            id: 1, 
            title: "Best pho in town", 
            info: "The broth is clear, flavorful, and not greasy at all! The rare steak was not overcooked; the flank was tender. The noodles were soft, but not too soft to break apart with chopsticks. Will go here again!",
            ordered: "P13 - Rare Steak and Flank Beef Noodle Soup", 
            rating: 5, 
            date: "2019-11-10T00:00:00.000Z", 
            eatery_id: 1
          },
          {
            id: 2, 
            title: "Softest bread", 
            info: "The lines were a little long, but worth it. Softest bread roll to start the day. The aroma was perfect, resembling a nice cup of freshly brewed coffee, and the flavor was not overbearing", 
            ordered: "Morning Coffee Roll", 
            rating: 4, 
            date: "2019-09-05T00:00:00.000Z", 
            eatery_id: 2},
          {
            id: 3, 
            title: "Local Homemade Noodles", 
            info: "First time visiting this place. The noodles were definitely home made, but not of a very consistent shape. They tasted okay, but the broth was a little greasy and there weren't a lot of side dish selections. Might try again later to see if they improve over time.",
            ordered: "Chicken & Noodles with Leek",
            rating: 3,
            date: "2019-07-05T00:00:00.000Z",
            eatery_id: 3
          },
          {
            id: 4, 
            title: "Fluffy cake", 
            info: "Usually the go-to is bread, but wanted to give the cakes a try. The Peach Fluff caught my eye. The colors were pleasant, and there were small decorative, edible peaches on top. It wasn't overly sweet, but was sweet enough. The cake feels like it melts when eaten, moist and soft, very fluffy like peach cotton candy.",
            ordered: "Peach Fluff Layered Cake",
            rating: 5,
            date: "2019-12-10T00:00:00.000Z",
            eatery_id: 2
          },
          {
            id: 5, 
            title: "Smooth noodles", 
            info: "Tried to eat their noodles again later. The broth and noodle quality improved quite a lot. They're a more consistent shape now and the broth is less greasy. The meat and vegetable ratio was really nice as well. Great aroma.",
            ordered: "Lamb Noodle Broth with Chives and Mushrooms",
            rating: 4,
            date: "2019-11-09T00:00:00.000Z",
            eatery_id: 3
          }
    ];
}

function makeFlavorLogsNoId() {
    return [
        {
            title: "Best pho in town", 
            info: "The broth is clear, flavorful, and not greasy at all! The rare steak was not overcooked; the flank was tender. The noodles were soft, but not too soft to break apart with chopsticks. Will go here again!",
            ordered: "P13 - Rare Steak and Flank Beef Noodle Soup", 
            rating: 5, 
            date: "2019-11-10T00:00:00.000Z", 
            eatery_id: 1
          },
          {
            title: "Softest bread", 
            info: "The lines were a little long, but worth it. Softest bread roll to start the day. The aroma was perfect, resembling a nice cup of freshly brewed coffee, and the flavor was not overbearing", 
            ordered: "Morning Coffee Roll", 
            rating: 4, 
            date: "2019-09-05T00:00:00.000Z", 
            eatery_id: 2},
          {
            title: "Local Homemade Noodles", 
            info: "First time visiting this place. The noodles were definitely home made, but not of a very consistent shape. They tasted okay, but the broth was a little greasy and there weren't a lot of side dish selections. Might try again later to see if they improve over time.",
            ordered: "Chicken & Noodles with Leek",
            rating: 3,
            date: "2019-07-05T00:00:00.000Z",
            eatery_id: 3
          },
          {
            title: "Fluffy cake", 
            info: "Usually the go-to is bread, but wanted to give the cakes a try. The Peach Fluff caught my eye. The colors were pleasant, and there were small decorative, edible peaches on top. It wasn't overly sweet, but was sweet enough. The cake feels like it melts when eaten, moist and soft, very fluffy like peach cotton candy.",
            ordered: "Peach Fluff Layered Cake",
            rating: 5,
            date: "2019-12-10T00:00:00.000Z",
            eatery_id: 2
          },
          {
            title: "Smooth noodles", 
            info: "Tried to eat their noodles again later. The broth and noodle quality improved quite a lot. They're a more consistent shape now and the broth is less greasy. The meat and vegetable ratio was really nice as well. Great aroma.",
            ordered: "Lamb Noodle Broth with Chives and Mushrooms",
            rating: 4,
            date: "2019-11-09T00:00:00.000Z",
            eatery_id: 3
          }
    ];
}

module.exports = {
    makeFlavorLogsArray,
    makeFlavorLogsNoId
}
