// Stable supplied artwork/identity only. Commercial fields come from the database.
export const catalogIds = ['marlins-playing-top','marlins-basketball-singlet','marlins-polo','marlins-training-shirt','marlins-shorts','marlins-long-sleeve-top','marlins-softshell-jacket','marlins-hoodie','marlins-slicker-jacket','marlins-bucket-hat','marlins-fitted-cap','marlins-beach-towel'] as const;
export const catalogCategories = ['Playing','Training','Outerwear','Accessories'] as const;
export function catalogId(value: unknown): value is string { return typeof value === 'string' && (catalogIds as readonly string[]).includes(value); }
export function catalogImage(id: string) { return `/images/merchandise/marlins/${id}.webp`; }
export function artworkDimensions(id:string){const index=(catalogIds as readonly string[]).indexOf(id);const dimensions=[[152,96],[146,96],[143,96],[152,82],[146,82],[143,82],[152,87],[146,87],[143,80],[152,60],[146,60],[143,64]][index];return {width:dimensions[0],height:dimensions[1]};}
