
export function up(knex) {
    return knex.schema.createTable("data", tbl => {
        tbl.increments()

        tbl
            .text("vin", 17)
            .unique()
            .notNullable()

        tbl.text("first_name", 128).notNullable
        tbl.text("last_name").notNullable
        tbl.text("number", 7).notNullable
    })
}

export function down(knex) {
    return knex.schema.dropTableIfExists("data")
}
