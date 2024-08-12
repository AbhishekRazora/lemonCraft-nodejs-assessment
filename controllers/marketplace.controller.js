
import Asset from '../models/asset.model.js';

export const listAssetOnMarketplace = async (req, res) => {
  try {
    const { id } = req.params;
    const asset = await Asset.findByIdAndUpdate(id, { isListed: true }, { new: true });
    res.status(200).json({ message: 'Asset published successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAssetsOnMarketplace = async (req, res) => {
  try {
    const assets = await Asset.find({ isListed: true });
    res.status(200).json(assets);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
