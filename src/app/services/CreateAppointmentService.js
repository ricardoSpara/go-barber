import { startOfHour, parseISO, isBefore, format } from 'date-fns';
import pt from 'date-fns/locale/pt';

import User from '../models/User';
import Appointment from '../models/Appointment';
import Notification from '../schemas/Notification';
import Cache from '../../lib/Cache';

class CreateAppointmentService {
  async run({ provider_id, user_id, date }) {
    /**
     * check if user is same as provider
     */
    if (user_id === provider_id) {
      throw new Error('User is same as provider');
    }

    /**
     * chek if provider_id is a provider
     */
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      throw new Error('You can only create appointments with providers');
    }

    const hourStart = startOfHour(parseISO(date));

    /**
     * check for past dates
     */
    if (isBefore(hourStart, new Date())) {
      throw new Error('Past dates are not permited');
    }

    /**
     * check date availability
     */
    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkAvailability) {
      throw new Error('Appointment date is not available');
    }

    const appointment = await Appointment.create({
      user_id,
      provider_id,
      date: hourStart,
    });

    /**
     * Notify appointment provider
     */
    const { name } = await User.findByPk(user_id);
    const dateFormated = format(hourStart, "'dia' dd 'de' MMMM', às' H:mm'h'", {
      locale: pt,
    });

    await Notification.create({
      content: `Novo agendamento de ${name} para ${dateFormated}`,
      user: provider_id,
    });

    /**
     * invalidate cache
     */
    await Cache.invalidatePrefix(`user:${user_id}:appointments`);

    return appointment;
  }
}

export default new CreateAppointmentService();
