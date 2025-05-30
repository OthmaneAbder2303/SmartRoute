import psycopg2

# PostgreSQL connection parameters
conn = psycopg2.connect(
    dbname="smartroute",
    user="postgres",
    password="postgres",#hna dkhlo user o password dialkom
    host="localhost",  # or your server address
    port="5432"
)

cursor = conn.cursor()
# CREATE TABLE if it doesn't exist
create_table_sql = """
CREATE TABLE IF NOT EXISTS famous_places (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL
);
"""
cursor.execute(create_table_sql)
conn.commit()

# SQL INSERT query
sql = """
INSERT INTO famous_places (name, description, latitude, longitude) VALUES
('Koutoubia Mosque', 'The largest mosque in Marrakech with a 77-meter minaret, built in the 12th century.', 31.624000, -7.989000),
('Bahia Palace', 'A 19th-century palace known for its beautiful architecture and gardens.', 31.622500, -7.981100),
('El Badi Palace', 'Ruins of a once-grand 16th-century palace built by Sultan Ahmad al-Mansur.', 31.617500, -7.985600),
('Saadian Tombs', 'Mausoleum of the Saadian dynasty, rediscovered in 1917.', 31.618500, -7.985900),
('Ben Youssef Madrasa', '14th-century Islamic college known for its intricate design.', 31.633500, -7.989100),
('Jemaa el-Fnaa', 'The main square of Marrakech Medina, full of life, performers, and markets.', 31.625800, -7.989400),
('Menara Gardens', 'Historic gardens and pavilion from the 12th century.', 31.616800, -8.011900),
('Majorelle Garden', 'Botanical garden and museum founded by Jacques Majorelle, restored by Yves Saint Laurent.', 31.640000, -8.002000),
('Dar Si Said Museum', 'Museum of Moroccan arts, located in a traditional palace.', 31.622000, -7.981500),
('Bab Agnaou Gate', '12th-century ornamental gate to the southern part of the Medina.', 31.618100, -7.989700),
('Maison de la Photographie', 'Museum showcasing Moroccan photography and culture.', 31.633300, -7.984700),
('Le Jardin Secret', 'Restored 19th-century palace with traditional Islamic gardens.', 31.631500, -7.988800),
('Dar El Bacha – Musée des Confluences', 'Museum displaying Moroccan art and culture in a historic palace.', 31.630000, -7.989000),
('Cyber Park Arsat Moulay Abdeslam', 'Historic public garden with free Wi-Fi and cultural exhibits.', 31.626500, -7.993000),
('Palais des Congrès', 'Convention center hosting various events and exhibitions.', 31.625000, -8.010000),
('Royal Theatre', 'Cultural venue for performing arts and concerts.', 31.625800, -8.008900),
('Marrakech Museum', 'Museum featuring Moroccan art, housed in the Dar Menebhi Palace.', 31.633000, -7.984000),
('Almoravid Koubba', '12th-century domed structure, the only surviving Almoravid building in Marrakech.', 31.633800, -7.984500),
('Tiskiwin Museum', 'Museum showcasing Saharan culture and artifacts.', 31.621500, -7.981800),
('Bab Doukkala Mosque', 'Historic mosque known for its architecture and significance.', 31.634200, -7.993600),
('Madrasa Ali Ben Youssef', 'Restored Islamic school showcasing exquisite Moorish architecture.', 31.633700, -7.989200),
('Palais de la Mamounia', 'Legendary luxury hotel set in stunning gardens, hosting world-famous guests.', 31.625600, -7.987900),
('Musée de l''Eau', 'Museum dedicated to water history and conservation in Marrakech.', 31.626100, -7.992500),
('Atlas Mountains Viewpoint', 'Scenic overlook offering panoramic views of the nearby Atlas Mountains.', 31.620000, -8.020000),
('Souk Semmarine', 'Traditional covered market, the largest in Marrakech, selling spices, textiles, and crafts.', 31.626300, -7.988700),
('Marrakech Palm Grove', 'Extensive palm plantation on the city''s outskirts, offering a tranquil escape.', 31.640500, -8.030000),
('Marrakech Railway Station', 'Modern transportation hub connecting Marrakech to other Moroccan cities.', 31.636000, -8.005600),
('Dar El Bacha Palace', 'Stunning 19th-century palace showcasing traditional Moroccan architecture.', 31.630500, -7.988500),
('Marrakech Synagogue', 'Historic synagogue representing the Jewish heritage of Marrakech.', 31.632000, -7.985300),
('Contemporary Art Gallery', 'Modern art space showcasing local and international contemporary artists.', 31.627500, -7.986800),
('Marrakech Botanical Research Center', 'Scientific institution studying local plant species and conservation.', 31.619000, -8.015000),
('Traditional Ceramic Workshop', 'Artisan space demonstrating traditional Moroccan ceramic-making techniques.', 31.628200, -7.990100),
('Berber Heritage Museum', 'Museum dedicated to the culture and history of the Berber people.', 31.621800, -7.982500),
('Marrakech Craft Market', 'Open-air market featuring local artisans and traditional craftsmanship.', 31.627000, -7.989900),
('Andalusian Gardens', 'Restored gardens showcasing the Moorish influence on Marrakech landscape.', 31.623500, -7.982800),
('Marrakech Astronomical Observatory', 'Scientific facility studying celestial bodies and astronomical phenomena.', 31.635000, -8.025000),
('Traditional Music Center', 'Cultural institution preserving and promoting traditional Moroccan music.', 31.629700, -7.987600),
('Marrakech Ethnographic Museum', 'Museum exploring the diverse cultural traditions of Morocco.', 31.622300, -7.983000),
('Historic Hammam', 'Traditional bathhouse showcasing centuries-old bathing rituals.', 31.630800, -7.988200),
('Marrakech Culinary Institute', 'Cooking school teaching traditional and modern Moroccan cuisine.', 31.626700, -7.991500),
('Textile Preservation Center', 'Research and conservation facility for traditional Moroccan textiles.', 31.624500, -7.985500),
('Kasbah Mosque', 'Historic mosque in the Kasbah area with significant architectural features.', 31.619800, -7.987200),
('Modern Art Pavilion', 'Contemporary art space featuring works by local and international artists.', 31.628800, -7.986300),
('Marrakech Urban Agriculture Center', 'Innovative facility exploring sustainable urban farming techniques.', 31.633000, -8.010000),
('Traditional Calligraphy School', 'Educational center teaching the art of Arabic calligraphy.', 31.627300, -7.989400),
('Marrakech Natural History Museum', 'Museum showcasing the flora, fauna, and geological history of the region.', 31.624700, -8.005000),
('Ancient Water Clock Tower', 'Restored historical site featuring traditional water measurement techniques.', 31.632500, -7.985700),
('Eco-Innovation Center', 'Research facility focusing on sustainable technologies and environmental solutions.', 31.637000, -8.015000),
('Marrakech Folklore Museum', 'Museum celebrating the rich cultural traditions of Moroccan folklore.', 31.625200, -7.983500),
('Traditional Carpet Cooperative', 'Artisan workshop preserving and producing traditional Berber carpets.', 31.629000, -7.990500),
('Marrakech Solar Research Station', 'Scientific facility studying solar energy and renewable technologies.', 31.640000, -8.035000),
('Historic Spice Market', 'Traditional market showcasing the rich culinary heritage of Marrakech.', 31.626600, -7.988300),
('Marrakech Herbalist Garden', 'Botanical garden displaying medicinal and culinary herbs of Morocco.', 31.620500, -8.012000),
('Contemporary Architecture Center', 'Exhibition space exploring modern architectural trends in Morocco.', 31.628500, -7.987000),
('Traditional Metalwork Studio', 'Artisan workshop demonstrating intricate Moroccan metalworking techniques.', 31.627800, -7.991000),
('Marrakech Wildlife Conservation Center', 'Research facility focused on protecting local and endangered species.', 31.618000, -8.020000),
('Islamic Art Restoration Workshop', 'Specialized center for preserving and restoring Islamic artistic heritage.', 31.631200, -7.985900),
('Marrakech Sustainable Fashion Hub', 'Creative space promoting eco-friendly and traditional Moroccan fashion.', 31.626900, -7.990700),
('Traditional Woodcarving Center', 'Artisan workshop showcasing intricate Moroccan woodcarving techniques.', 31.629500, -7.988900),
('Marrakech Climate Research Institute', 'Scientific facility studying regional climate patterns and changes.', 31.636500, -8.030000),
('Historic Leather Tannery', 'Traditional facility demonstrating ancient leather production methods.', 31.625700, -7.986000),
('Marrakech Digital Innovation Lab', 'Technology center exploring digital solutions for urban challenges.', 31.630200, -8.005500),
('Traditional Perfume Museum', 'Museum exploring the art of fragrance-making in Moroccan culture.', 31.623800, -7.984500),
('Marrakech Sustainable Agriculture Project', 'Research facility developing innovative agricultural techniques.', 31.634000, -8.020000),
('Contemporary Jewelry Design Studio', 'Creative space showcasing modern and traditional Moroccan jewelry.', 31.627600, -7.989700),
('Marrakech Urban Ecology Center', 'Research facility studying urban ecosystems and environmental sustainability.', 31.632000, -8.015000),
('Traditional Pottery Village', 'Artisan community preserving and practicing traditional pottery techniques.', 31.625300, -7.987600),
('Marrakech Renewable Energy Park', 'Innovative facility demonstrating sustainable energy technologies.', 31.639000, -8.040000),
('Historic Olive Oil Press', 'Preserved facility showcasing traditional olive oil production methods.', 31.620200, -8.008000),
('Marrakech Artisan Incubator', 'Support center for emerging traditional and contemporary craft entrepreneurs.', 31.628700, -7.991500),
('Traditional Basket Weaving Center', 'Workshop preserving and teaching traditional Moroccan basket-making techniques.', 31.626400, -7.990300),
('Marrakech Urban Planning Museum', 'Exhibition space exploring the city''s architectural and urban development.', 31.631000, -8.000000),
('Contemporary Dance Studio', 'Cultural space promoting modern and traditional Moroccan dance forms.', 31.627200, -7.988500),
('Marrakech Botanical Conservation Center', 'Research facility dedicated to preserving local plant biodiversity.', 31.618500, -8.025000),
('Traditional Lantern Workshop', 'Artisan space creating intricate Moroccan metalwork and lighting designs.', 31.629800, -7.989800),
('Marrakech Water Management Institute', 'Scientific facility studying water resources and conservation strategies.', 31.635500, -8.025000),
('Historic Silk Trading House', 'Preserved building showcasing Marrakech''s historical silk trade importance.', 31.624900, -7.985200),
('Marrakech Cultural Heritage Laboratory', 'Research center studying and preserving Marrakech''s cultural artifacts.', 31.630700, -7.987300),
('Traditional Aromatherapy Center', 'Facility exploring the therapeutic uses of traditional Moroccan essential oils.', 31.626200, -7.991800),
('Marrakech Urban Resilience Hub', 'Research center developing strategies for urban sustainability and adaptation.', 31.633500, -8.035000),
('Contemporary Music Conservatory', 'Educational institution preserving and innovating Moroccan musical traditions.', 31.628000, -7.987500),
('Marrakech Ethnobotanical Garden', 'Botanical space exploring the relationship between plants and local cultures.', 31.619500, -8.018000),
('Traditional Jewelry Restoration Workshop', 'Specialized center preserving and restoring historic Moroccan jewelry.', 31.627500, -7.990000),
('Marrakech Urban Agriculture Innovation Center', 'Facility developing cutting-edge urban farming technologies.', 31.634500, -8.010000),
('Historic Olive Grove', 'Preserved agricultural site showcasing traditional olive cultivation methods.', 31.621000, -8.012500),
('Marrakech Sustainable Tourism Lab', 'Research center developing eco-friendly tourism strategies.', 31.632500, -8.020000),
('Traditional Natural Dye Workshop', 'Artisan space preserving traditional textile dyeing techniques.', 31.626800, -7.989600),
('Marrakech Cultural Landscape Observatory', 'Research facility studying the evolution of Marrakech''s cultural landscape.', 31.630000, -8.005000),
('Contemporary Moroccan Cinema Center', 'Cultural space promoting and preserving Moroccan film heritage.', 31.628300, -7.986700),
('Marrakech Biodiversity Research Station', 'Scientific facility studying local ecological systems and conservation.', 31.617500, -8.030000),
('Traditional Calligraphy and Manuscript Center', 'Preservation and study center for historic Arabic manuscripts.', 31.631500, -7.985500),
('Marrakech Urban Mobility Innovation Hub', 'Research center developing sustainable transportation solutions.', 31.636000, -8.015000),
('Historic Caravan Serai', 'Preserved historical building representing Marrakech''s trading heritage.', 31.625600, -7.986400),
('Marrakech Cultural Fusion Laboratory', 'Creative space exploring intersections of traditional and modern culture.', 31.629300, -7.988000),
('Traditional Herbal Medicine Center', 'Research facility studying traditional Moroccan healing practices.', 31.627000, -7.991200),
('Marrakech Urban Resilience and Adaptation Center', 'Scientific facility developing strategies for urban environmental challenges.', 31.633000, -8.040000),
('Contemporary Craft Innovation Studio', 'Creative space merging traditional craftsmanship with modern design.', 31.628600, -7.990400),
('Marrakech Living Heritage Museum', 'Museum showcasing the continuous cultural traditions of Marrakech.', 31.624600, -7.984800),
('Traditional Astronomical Observatory', 'Historical site exploring traditional astronomical observation techniques.', 31.635500, -8.030000),
('Marrakech Urban Ecology and Design Center', 'Interdisciplinary facility studying urban ecosystems and sustainable design.', 31.632000, -8.025000);

"""

# Execute and commit
cursor.execute(sql)
conn.commit()

print("Data inserted successfully.")

# Close the connection
cursor.close()
conn.close()
