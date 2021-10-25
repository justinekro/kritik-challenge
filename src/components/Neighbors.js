export const Neighbors = ({ countries = [] }) => {
  if (countries.length === 0) return null;

  const neighbors = getNeighbors(countries);

  return (
    <div>
      <h3>Neighbors</h3>
      {neighbors.length > 0
        ? neighbors.map((neighbors) => (
            <div key={`${neighbors[0]}-${neighbors[1]}`}>
              {neighbors[0]}, {neighbors[1]}
            </div>
          ))
        : 'No grouping found'}
    </div>
  );
};

const getNeighbors = (countries) =>
  countries.reduce((neighbors, country, index) => {
    country.neighbors
      .filter(
        (neighbor, i) =>
          index !== i && countries.find((c) => c.name === neighbor.name)
      )
      .forEach((neighbor) => {
        const pair = [country.name, neighbor.name].sort();
        if (
          !neighbors.some(
            (existingPair) =>
              existingPair[0] === pair[0] && existingPair[1] === pair[1]
          )
        ) {
          neighbors.push(pair);
        }
      });
    return neighbors;
  }, []);
