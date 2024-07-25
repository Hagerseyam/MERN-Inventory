const mongoose = require('mongoose');
const Autoincrement = require('mongoose-sequence')(mongoose);


const NoteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        default: 'Employee'
    },
    completed: {
        type: Boolean,
        default: false
    },

},{
     timestamps: true ,
}
)

NoteSchema.plugin(Autoincrement, {inc_field: 'ticket',
    id: 'ticketNums',
    inc_field: 'ticket',
    startAt: 500,
});

module.exports = mongoose.model('Note', NoteSchema);