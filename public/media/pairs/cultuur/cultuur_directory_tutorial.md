To initialize this /public/media/pairs/cultuur directory you will need to do the following:

- Add atleast one pair of images in .jpg or .png format to the directory.
- For each pair added, they must have the naming 'pair1a' and 'pair1b' for the first set of pairs. And so on for the rest, so the 4th pair set would be named 'pair4a' and 'pair4b'.
- Add a file named 'pairNames.json' to /public/media/pairs/cultuur
- The content of /public/media/pairs/cultuur/pairNames.json should be the namings of each pair and should be setup in the following example format if you have 4 image pairs (change the names to what the pairs represent):

```sh
{
    "pair1": {
        "names": ["Mens erger je niet", "Kaarten"]
    },
    "pair2": {
        "names": ["Tuinieren", "Bakken"]
    },
    "pair3": {
        "names": ["Fietsen", "Wandelen"]
    },
    "pair4": {
        "names": ["Zwemmen", "Voetbal"]
    }
}
```

This is required for the app to run properly.