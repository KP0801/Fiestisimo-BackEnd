const Reservation = require('../models/reservation');
const ReservationDetail = require('../models/detailsReservation');
const Product = require('../models/products');
const User = require('../models/customers')
const {setupAssociations} = require('../models/associations');
const Sequelize = require('sequelize');
const { and } = require('sequelize');

// Llama a setupAssociations para configurar las asociaciones
setupAssociations();

//! Controlador para crear una reserva
exports.createReservation = async (req, res) => {
  try {
    const userId = req.token.userId;
    const productId = req.params.productId; 
    const { amount, deadline } = req.body;

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    // Reserva
    const reservation = await Reservation.create({
      userId: userId,
      deadline: deadline,
    });

    // Detalle de la reserva
    await ReservationDetail.create({
      reservationId: reservation.reservationId,
      productId,
      amount,
    });

    res.status(201).json({ message: 'Reserva creada exitosamente.' });
  } catch (error) {
    console.error('Error al crear la reserva:', error);
    res.status(500).json({ error: 'Hubo un problema al procesar la reserva.' });
  }
};

//! Cancelar una reservacion
exports.cancelReservation = async (req, res) => {
  try {
    const userId = req.token.userId;
    const {reservationId} = req.params;  

    // Verifica si la reserva pertenece al usuario
    const reservation = await Reservation.findOne({
      where: {
        reservationId,
        userId,
      },
    });

    if (!reservation) {
      return res.status(404).json({ error: 'Reserva no encontrada o no pertenece al usuario.' });
    }

    // No se puede cancelar si la reservacion esta en proceso o finalizada
    if (reservation.status === 'pendiente') {
      // Cancelar la reserva
      await Reservation.update({ status: 'cancelada' }, { where: { reservationId } });

      res.status(200).json({ message: 'Reserva cancelada exitosamente.' });
    } else {
      res.status(400).json({ error: 'No se puede cancelar una reserva en preparacion.' });
    }
  } catch (error) {
    console.error('Error al cancelar la reserva:', error);
    res.status(500).json({ error: 'Hubo un problema al procesar la cancelación de la reserva.' });
  }
};

//! Controlador que obtiene todas las reservaciones por cliente
exports.getAllReservationsByUser = async (req, res) => {
  try {
    const userId = req.token.userId;

    // Todas las reservaciones exepto canceladas
    const reservations = await Reservation.findAll({
      where: { userId, status: { [Sequelize.Op.not]: ['cancelada','finalizado'] }},
      include: [
        {
          model: ReservationDetail,
          include: [
            {
              model: Product,
              attributes: ['name', 'price', 'category'], 
            },
          ],
        },
      ],
    });

    // Todas las reservaciones que no esten canceladas
    const processedReservations = reservations.map((reservation) => {
      const processedDetails = reservation.ReservationDetails.map((detail) => ({
        reservationId: reservation.reservationId,
        deadline: reservation.deadline,
        status: reservation.status,
        productName: detail.Product.name,
        amount: detail.amount,
        price: detail.Product.price * detail.amount,
        category: detail.Product.category,
      }));

      return processedDetails;
    }).flat();

    res.status(200).json(processedReservations);
  } catch (error) {
    console.error('Error al obtener las reservaciones del usuario:', error);
    res.status(500).json({ error: 'Hubo un problema al obtener las reservaciones.' });
  }
};

//! Controlador que obtiene todas las reservaciones canceladas por cliente
exports.getCanceledReservationsByUser = async (req, res) => {
  try {
    const userId = req.token.userId;

    // Todas las reservaciones canceladas
    const canceledReservations = await Reservation.findAll({
      where: { userId, status: 'cancelada' },
      include: [
        {
          model: ReservationDetail,
          include: [
            {
              model: Product,
              attributes: ['name', 'price', 'category'], 
            },
          ],
        },
      ],
    });

    // Procesar las reservaciones para ajustar el precio por la cantidad
    const processedCanceledReservations = canceledReservations.map((reservation) => {
      const processedDetails = reservation.ReservationDetails.map((detail) => ({
        reservationId: reservation.reservationId,
        deadline: reservation.deadline,
        status: reservation.status,
        productName: detail.Product.name,
        amount: detail.amount,
        price: detail.Product.price * detail.amount,
        category: detail.Product.category,
      }));

      return processedDetails;
    }).flat();

    res.status(200).json(processedCanceledReservations);
  } catch (error) {
    console.error('Error al obtener las reservaciones canceladas del usuario:', error);
    res.status(500).json({ error: 'Hubo un problema al obtener las reservaciones canceladas.' });
  }
};

//! Controlador que obtiene todas las reservaciones
exports.getAllReservations = async (req, res) => {
  try {
    // Obtener todas las reservaciones con detalles, productos y usuario, ordenadas por fecha de vencimiento
    const allReservations = await Reservation.findAll({
      include: [
        {
          model: ReservationDetail,
          include: [
            {
              model: Product,
              attributes: ['name', 'price', 'category'],
            },
          ],
        },
        {
          model: User, // Incluir el modelo User
          attributes: ['name', 'phone'], // Seleccionar los campos necesarios del modelo User
        },
      ],
      order: [['deadline', 'DESC']],
    });

    // Procesar las reservaciones para ajustar el precio por la cantidad
    const processedAllReservations = allReservations.map((reservation) => {
      const processedDetails = reservation.ReservationDetails.map((detail) => ({
        reservationId: reservation.reservationId,
        deadline: reservation.deadline,
        status: reservation.status,
        productName: detail.Product.name,
        amount: detail.amount,
        price: detail.Product.price * detail.amount,
        category: detail.Product.category,
        user: {
          name: reservation.User.name,
          phone: reservation.User.phone,
        },
      }));

      return processedDetails;
    }).flat();

    res.status(200).json(processedAllReservations);
  } catch (error) {
    console.error('Error al obtener todas las reservaciones:', error);
    res.status(500).json({ error: 'Hubo un problema al obtener todas las reservaciones.' });
  }
};

//! Controlador para actualizar el status o el deadline de una reservación
exports.updateReservation = async (req, res) => {
  try {
    const {reservationId} = req.params;
    const { status, deadline } = req.body;

    // Verificar si la reservación existe
    const existingReservation = await Reservation.findByPk(reservationId);

    if (!existingReservation) {
      return res.status(404).json({ error: 'La reservación no existe.' });
    }

    // Actualizar el status y/o el deadline si se proporcionan en el cuerpo de la solicitud
    if (status) {
      existingReservation.status = status;
    }

    if (deadline) {
      existingReservation.deadline = deadline;
    }

    // Guardar los cambios en la base de datos
    await existingReservation.save();

    res.status(200).json({ message: 'Reservación actualizada exitosamente.' });
  } catch (error) {
    console.error('Error al actualizar la reservación:', error);
    res.status(500).json({ error: 'Hubo un problema al actualizar la reservación.' });
  }
};

//! Controlador que obtiene todas las reservaciones finalizadas por cliente
exports.getFinalizedReservationsByUser = async (req, res) => {
  try {
    const userId = req.token.userId;

    // Todas las reservaciones canceladas
    const canceledReservations = await Reservation.findAll({
      where: { userId, status: 'finalizado' },
      include: [
        {
          model: ReservationDetail,
          include: [
            {
              model: Product,
              attributes: ['name', 'price', 'category'], 
            },
          ],
        },
      ],
    });

    // Procesar las reservaciones para ajustar el precio por la cantidad
    const processedCanceledReservations = canceledReservations.map((reservation) => {
      const processedDetails = reservation.ReservationDetails.map((detail) => ({
        reservationId: reservation.reservationId,
        deadline: reservation.deadline,
        status: reservation.status,
        productName: detail.Product.name,
        amount: detail.amount,
        price: detail.Product.price * detail.amount,
        category: detail.Product.category,
      }));

      return processedDetails;
    }).flat();

    res.status(200).json(processedCanceledReservations);
  } catch (error) {
    console.error('Error al obtener las reservaciones canceladas del usuario:', error);
    res.status(500).json({ error: 'Hubo un problema al obtener las reservaciones canceladas.' });
  }
};