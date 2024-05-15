const { Keyboard } = require("puppeteer");

describe('Basic user flow for Website', () => {
    beforeAll(async () => {
        await page.goto('https://cloud1379.github.io/CSE110-SP24-Lab6-Template/');
    });

    it('Has add note button', async () => {
        const addNoteButton = await page.$('.add-note');
        const addNoteContents = await page.evaluate(button => button.innerText, addNoteButton);
        expect(addNoteContents).toBe('Add Note');
    })

    it('Add note creates new note', async () => {
        const addNoteButton = await page.$('.add-note');
        await addNoteButton.click();
        const totalNotes = await page.$$('.note');
        expect(totalNotes.length).toBe(1)
    })

    it('Edit new note functionality', async () => {
        const addNoteButton = await page.$('.add-note');
        await addNoteButton.click();
        const totalNotes = await page.$$('.note');
        const newNoteIndex = totalNotes.length - 1;
        const newNote = totalNotes[newNoteIndex];

        await newNote.click();
        await page.keyboard.type("hello");
        await page.keyboard.press("Tab");

        const savedNotes = await page.evaluate(() => {
            return localStorage.getItem("stickynotes-notes");
        })

        savedNotesParse = JSON.parse(savedNotes);
        newSavedNoteContent = savedNotesParse[newNoteIndex];
        expect(newSavedNoteContent.content).toBe("hello");
    })

    it('Edit old note functionality', async () => {
        const addNoteButton = await page.$('.add-note');
        await addNoteButton.click();
        const totalNotes = await page.$$('.note');
        const currentNoteIndex = 0;
        const currentNote = totalNotes[currentNoteIndex];

        await currentNote.click();

        await page.keyboard.type("world");
        await page.keyboard.press("Tab");
        await page.waitForFunction(() => localStorage.getItem("stickynotes-notes"));

        const savedNotes = await page.evaluate(() => {
            return localStorage.getItem("stickynotes-notes");
        });

        savedNotesParse = JSON.parse(savedNotes);
        newSavedNoteContent = savedNotesParse[currentNoteIndex];
        expect(newSavedNoteContent.content).toBe("world");

    })

    it('Notes are saved locally', async () => {
        const beforeReload = await page.evaluate(() => {
            return localStorage.getItem("stickynotes-notes");
        });

        await page.reload({ waitUnit: ['networkidle0', 'domcontentloaded']});

        const afterReload = await page.evaluate(() => {
            return localStorage.getItem("stickynotes-notes");
        });

        expect(afterReload).toBe(beforeReload);
    })

    it('Delete note by double clicking on note', async () => {
        const totalNotes = await page.$$('.note');
        const initialNoteNum = totalNotes.length;
        const newNoteIndex = totalNotes.length - 1;
        const newNote = totalNotes[newNoteIndex];

        await newNote.click({clickCount:2});

        const notesAfterDelete = await page.$$('.note');
        expect(notesAfterDelete.length).toBe(initialNoteNum - 1);
    })
});