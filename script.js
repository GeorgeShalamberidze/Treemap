const kickStarterURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json'
const movieURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json'
const videoGameURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json'

let kickStarterData;
let movieData;
let videoGameData;
const tooltip = d3.select('body')
    .append("div")
    .attr('id', 'tooltip')
    .style('opacity', 0)

d3.json(kickStarterURL)
    .then((data, error) => {
        if (error) {
            throw new Error('Could not find Data')
        }
        else {
            kickStarterData = data.children

            const treemap = d3.treemap()
                .size([960, 600])
                .padding(1)

            const root = d3
                .hierarchy(data)
                .sum(d => d.value)
                .sort((a, b) => {
                    return b.value - a.value
                })

            const svg = d3.select('#svg')

            treemap(root)

            d3.json(movieURL)
                .then((data, error) => {
                    if (error) {
                        throw new Error('Could not find Data')
                    }
                    else {
                        movieData = data.children
                        d3.json(videoGameURL)
                            .then((data, error) => {
                                if (error) {
                                    throw new Error('Could not find Data')
                                }
                                else {
                                    videoGameData = data.children
                                    const color = d3.scaleOrdinal(d3.schemeCategory10)

                                    const rect = svg.selectAll('g')
                                        .data(root.leaves())
                                        .enter()
                                        .append('g')
                                        .attr('transform', (d) => `translate(${d.x0}, ${d.y0})`)

                                    rect.append('rect')
                                        .attr('class', 'tile')
                                        .attr('width', d => d.x1 - d.x0)
                                        .attr('height', d => d.y1 - d.y0)
                                        .attr('fill', d => color(d.data.category))
                                        .attr('data-name', d => d.data.name)
                                        .attr('data-category', d => d.data.category)
                                        .attr('data-value', d => d.data.value)
                                        .on('mouseover', (d, i) => {
                                            tooltip.html(
                                                '<strong>Name</strong>: ' + i.data.name + '<br>'
                                                + '<strong>Category:</strong> ' + i.data.category + '<br>'
                                                + '<strong>value:</strong> ' + (i.data.value).slice(0, 4) / 100
                                            )
                                                .style('opacity', 0.9)
                                            tooltip.attr('data-value', () => i.data.value)

                                            onmousemove = function (e) {
                                                tooltip
                                                    .style('left', `${e.clientX - 80}px`)
                                                    .style('top', `${e.clientY - 100}px`)
                                            }
                                        })
                                        .on('mouseout', (_) => {
                                            tooltip.style('opacity', 0)
                                        })

                                    rect.append('text')
                                        .attr('id', 'text-id')
                                        .selectAll('tspan')
                                        .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
                                        .enter()
                                        .append('tspan')
                                        .attr('x', 2)
                                        .attr('y', (d, i) => 10 + i * 10)
                                        .text(d => d)
                                        .style('font-size', '10px')
                                        .style('overflow', 'hidden')

                                    // L E G E N D 
                                    const category = root.leaves().map(a => a.data.category).filter((item, index, array) => {
                                        return array.indexOf(item) === index
                                    })

                                    const cellSize = 20
                                    const legendWidth = 200
                                    const legendHeight = (cellSize + 5) * category.length

                                    const legend = d3.select('#treemap-id')
                                        .append('svg')
                                        .attr('id', 'legend')
                                        .append('g')
                                        .attr('width', legendWidth)
                                        .attr('height', 5000)

                                    legend.selectAll('rect')
                                        .data(category)
                                        .enter()
                                        .append('rect')
                                        .attr('class', 'legend-item')
                                        .attr('fill', (d) => color(d))
                                        .attr('x', 50)
                                        .attr('y', (d, i) => i * (cellSize + 2) + 20)
                                        .attr('width', cellSize)
                                        .attr('height', cellSize)

                                    legend.append('g')
                                        .selectAll('text')
                                        .data(category)
                                        .enter()
                                        .append('text')
                                        .attr('x', cellSize * 4)
                                        .attr('y', (d, i) => i * (cellSize + 2) + 34)
                                        .text(d => d)
                                }
                            })
                    }
                })
        }
    })

