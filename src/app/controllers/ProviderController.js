import User from '../models/User';
import File from '../models/File';
import Cache from '../../lib/Cache';

class ProviderController {
  async index(req, res) {
    const cachedProviders = await Cache.get('providers');

    if (cachedProviders) {
      res.json(cachedProviders);
    }
    const providers = await User.findAll({
      where: { provider: true },
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [
        { model: File, as: 'avatar', attributes: ['name', 'path', 'url'] },
      ],
    });

    Cache.set('providers', providers);

    res.json(providers);
  }
}

export default new ProviderController();
