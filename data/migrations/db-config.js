import knex from 'knex'
import config from '../knexfile.js'

const db = knex(config.development)

module.exports = {
    find,
    findById,
}

function find() {
    return db('data')
}

function findById() {
    return db('data').where({ id: Number(id) })
}