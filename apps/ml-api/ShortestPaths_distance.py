import geopandas as gpd
import networkx as nx
from shapely.geometry import Point, LineString

# Load GPKG roads layer
gdf = gpd.read_file("marrakech_streets.gpkg", layer="roads")

# Build the graph
G = nx.Graph()
for _, row in gdf.iterrows():
    geom: LineString = row.geometry
    coords = list(geom.coords)
    for i in range(len(coords) - 1):
        start = coords[i]
        end = coords[i + 1]
        dist = Point(start).distance(Point(end))
        G.add_edge(start, end, weight=dist)

# Find nearest graph node to a point
def find_nearest_node(G, point):
    return min(G.nodes, key=lambda n: Point(n).distance(Point(point)))

# Compute shortest path and distance
def get_shortest_path(G, start_coords, end_coords):
    start_node = find_nearest_node(G, start_coords)
    end_node = find_nearest_node(G, end_coords)
    path = nx.shortest_path(G, source=start_node, target=end_node, weight='weight')
    distance = nx.shortest_path_length(G, source=start_node, target=end_node, weight='weight')
    return {
        "path": path,
        "distance": distance
    }

# Example usage (longitude, latitude)
print(get_shortest_path(G, (-8.012, 31.616), (-7.989, 31.625)))
