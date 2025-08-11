
const db = require('../models');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class ReservationsDBApi {

    static async create(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const reservations = await db.reservations.create(
            {
                id: data.id || undefined,

        reservation_date: data.reservation_date
        ||
        null
            ,

        pickup_location: data.pickup_location
        ||
        null
            ,

            importHash: data.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
    },
        { transaction },
    );

        return reservations;
    }

    static async bulkImport(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        // Prepare data - wrapping individual data transformations in a map() method
        const reservationsData = data.map((item, index) => ({
                id: item.id || undefined,

                reservation_date: item.reservation_date
            ||
            null
            ,

                pickup_location: item.pickup_location
            ||
            null
            ,

            importHash: item.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
            createdAt: new Date(Date.now() + index * 1000),
    }));

        // Bulk create items
        const reservations = await db.reservations.bulkCreate(reservationsData, { transaction });

        return reservations;
    }

    static async update(id, data, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const reservations = await db.reservations.findByPk(id, {}, {transaction});

        const updatePayload = {};

        if (data.reservation_date !== undefined) updatePayload.reservation_date = data.reservation_date;

        if (data.pickup_location !== undefined) updatePayload.pickup_location = data.pickup_location;

        updatePayload.updatedById = currentUser.id;

        await reservations.update(updatePayload, {transaction});

        return reservations;
    }

    static async deleteByIds(ids, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const reservations = await db.reservations.findAll({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
            transaction,
        });

        await db.sequelize.transaction(async (transaction) => {
            for (const record of reservations) {
                await record.update(
                    {deletedBy: currentUser.id},
                    {transaction}
                );
            }
            for (const record of reservations) {
                await record.destroy({transaction});
            }
        });

        return reservations;
    }

    static async remove(id, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const reservations = await db.reservations.findByPk(id, options);

        await reservations.update({
            deletedBy: currentUser.id
        }, {
            transaction,
        });

        await reservations.destroy({
            transaction
        });

        return reservations;
    }

    static async findBy(where, options) {
        const transaction = (options && options.transaction) || undefined;

        const reservations = await db.reservations.findOne(
            { where },
            { transaction },
        );

        if (!reservations) {
            return reservations;
        }

        const output = reservations.get({plain: true});

        return output;
    }

    static async findAll(filter, options) {
        const limit = filter.limit || 0;
        let offset = 0;
        let where = {};
        const currentPage = +filter.page;

        const user = (options && options.currentUser) || null;

        offset = currentPage * limit;

        const orderBy = null;

        const transaction = (options && options.transaction) || undefined;

        let include = [];

        if (filter) {
            if (filter.id) {
                where = {
                    ...where,
                    ['id']: Utils.uuid(filter.id),
                };
            }

            if (filter.reservation_dateRange) {
                const [start, end] = filter.reservation_dateRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                    reservation_date: {
                    ...where.reservation_date,
                            [Op.gte]: start,
                    },
                };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                    reservation_date: {
                    ...where.reservation_date,
                            [Op.lte]: end,
                    },
                };
                }
            }

            if (filter.active !== undefined) {
                where = {
                    ...where,
                    active: filter.active === true || filter.active === 'true'
                };
            }

            if (filter.pickup_location) {
                where = {
                    ...where,
                pickup_location: filter.pickup_location,
            };
            }

            if (filter.createdAtRange) {
                const [start, end] = filter.createdAtRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                        ['createdAt']: {
                            ...where.createdAt,
                            [Op.gte]: start,
                        },
                    };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                        ['createdAt']: {
                            ...where.createdAt,
                            [Op.lte]: end,
                        },
                    };
                }
            }
        }

        const queryOptions = {
            where,
            include,
            distinct: true,
            order: filter.field && filter.sort
                ? [[filter.field, filter.sort]]
                : [['createdAt', 'desc']],
            transaction: options?.transaction,
            logging: console.log
        };

        if (!options?.countOnly) {
            queryOptions.limit = limit ? Number(limit) : undefined;
            queryOptions.offset = offset ? Number(offset) : undefined;
        }

        try {
            const { rows, count } = await db.reservations.findAndCountAll(queryOptions);

            return {
                rows: options?.countOnly ? [] : rows,
                count: count
            };
        } catch (error) {
            console.error('Error executing query:', error);
            throw error;
        }
    }

    static async findAllAutocomplete(query, limit, offset) {
        let where = {};

        if (query) {
            where = {
                [Op.or]: [
                    { ['id']: Utils.uuid(query) },
                    Utils.ilike(
                        'reservations',
                        'guest',
                        query,
                    ),
                ],
            };
        }

        const records = await db.reservations.findAll({
            attributes: [ 'id', 'guest' ],
            where,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            orderBy: [['guest', 'ASC']],
        });

        return records.map((record) => ({
            id: record.id,
            label: record.guest,
        }));
    }

};

