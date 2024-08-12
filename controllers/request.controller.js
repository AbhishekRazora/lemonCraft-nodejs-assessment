import Request from '../models/request.model.js';
import Asset from '../models/asset.model.js';
export const requestToBuy = async (req, res) => {
  try {
    const { id } = req.params;
    const { proposedPrice } = req.body;

    const request = await Request.create({
      asset: id,
      buyer: req.user._id,
      proposedPrice
    });

    const asset = await Asset.findById(id);
    asset.proposals += 1;
    await asset.save();

    res.status(201).json({ message: 'Purchase request sent' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const negotiateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { newProposedPrice } = req.body;

    const request = await Request.findById(id);
    request.proposedPrice = newProposedPrice;
    request.negotiationHistory.push({ price: newProposedPrice });
    await request.save();

    res.status(200).json({ message: 'Negotiation updated' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const acceptRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await Request.findById(id);
    request.status = 'accepted';
    await request.save();

    const asset = await Asset.findById(request.asset);
    asset.currentHolder = request.buyer;
    asset.lastTradingPrice = request.proposedPrice;
    asset.numberOfTransfers += 1;
    asset.tradingJourney.push({ holder: request.buyer, price: request.proposedPrice });
    await asset.save();

    res.status(200).json({ message: 'Request accepted, holder updated' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const denyRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await Request.findById(id);
    request.status = 'denied';
    await request.save();

    res.status(200).json({ message: 'Request denied' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getUserRequests = async (req, res) => {
  try {
    const requests = await Request.find({ buyer: req.user._id });
    res.status(200).json(requests);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
