

class Song {
    constructor(title, artist, composer, year) {
        this.title = title;
        this.artist = artist;
        this.composer = composer;
        this.year = year;
    }
}


class UI {
    // function for UI class to add song to list;
    addSongToList(song) {
        const list = document.getElementById('song-list');
        // Create table row element
        const row = document.createElement('tr');
        // Insert columns
        row.innerHTML = `
            <td>${song.title}</td>
            <td>${song.artist}</td>
            <td>${song.composer}</td>
            <td>${song.year}</td>
            <td><a href="#" class="delete">X</a> </td>
        `;

        list.appendChild(row);
    }

    showAlert(message, className) {
        // create div
        const div = document.createElement('div');
        // Add classes
        div.className = `alert ${className}`;
        //Add alert text
        div.appendChild(document.createTextNode(message));
        // get parent
        const container = document.querySelector('.container');
        const form = document.querySelector('#song-form');
        // Insert alert
        container.insertBefore(div, form);
        // Time out after 3 seconds
        setTimeout(() => {
            document.querySelector('.alert').remove();
        }, 3000);
    }

    deleteSong(target) {
        if (target.className === 'delete') {
            target.parentElement.parentElement.remove();
        }
    }

    clearFields() {
        document.getElementById('title').value = '';
        document.getElementById('artist').value = '';
        document.getElementById('composer').value = '';
        document.getElementById('year').value = '';
    }
}


// Local Storage class
class Store {

    // Get Songs from local storage
    static getSongs() {
        let songs;
        if (localStorage.getItem('songs') === null) {
            songs = [];
        } else {
            songs = JSON.parse(localStorage.getItem('songs'));
        }
        return songs;
    }

    // Display songs in UI
    static displaySongs() {
        const songs = Store.getSongs();

        songs.forEach(function (song) {
            const ui = new UI;
            // Add song to list
            ui.addSongToList(song);
        })
    }

    // Add song details to local storage
    static addSong(song) {
        const songs = Store.getSongs();
        songs.push(song);

        // Store to local storage
        localStorage.setItem('songs', JSON.stringify(songs));
    }

    static removeSongs(composer) {
        const songs = Store.getSongs();
        songs.forEach(function (song, index) {
            if (song.composer === composer) {
                songs.splice(index, 1);
            }
        });
        localStorage.setItem('songs', JSON.stringify(songs));
    }
}


// DOM Load event 
document.addEventListener('DOMContentLoaded', Store.displaySongs());

// Event listeners for Add song
document.getElementById('song-form').addEventListener('submit',
    function (e) {
        // Get form values
        const title = document.getElementById('title').value;
        const artist = document.getElementById('artist').value;
        const composer = document.getElementById('composer').value;
        const year = document.getElementById('year').value;


        // Instantiate a song
        const song = new Song(title, artist, composer, year);

        // Instantiate UI object
        const ui = new UI();

        // Validate 
        if (title === '' || artist === '' || composer === '' || year === '' ) {
            // Show Error alert
            ui.showAlert('Please fill in all fields', 'error');
        } else {
            // Add song to list
            ui.addSongToList(song)

            // Show success alert
            ui.showAlert('Song Added', 'success');
            // Add to local storage
            Store.addSong(song);

            // Clear UI fields
            ui.clearFields();
        }

        e.preventDefault();
    });

// Event listener for Delete    
document.getElementById('song-list').addEventListener('click', function (e) {
    // Instantiate UI
    const ui = new UI();

    // Delete song
    ui.deleteSong(e.target);

    // Remove from local storage using composer name
    Store.removeSongs(e.target.parentElement.previousElementSibling.textContent)

    // Show alert
    ui.showAlert('Song Removed', 'success');

    e.preventDefault();
})