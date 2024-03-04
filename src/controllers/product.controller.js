import { productService } from "../services/index.js";
import { productsManager } from "../dao/product.dao.mongoose.js";
export async function getProductController(req, res) {
  const options = {
    page: req.query.page || 1,
    limit: req.query.limit || 10,
    sort: { price: req.query.sort === "asc" ? 1 : -1 },
  };

  const query = {};
  if (req.query.category) {
    query.category = req.query.category;
  }
  if (req.query.status !== undefined) {
    query.status = req.query.status === "true";
  }
  try {
    const data = await productsManager.paginate(query, options);

    const response = {
      status: res.status,
      payload: data.docs,
      currentPage: data.page,
      totalPages: data.totalPages,
      totalItems: data.totalDocs,
    };

    res.status(200).send(response);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
}

export async function getProductControllerId(req, res) {
  const id = req.params.id;
  try {
    const productForId = await productService.getProductByIdService(id);
    return res.json({ productForId });
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
}

export async function postProductController(req, res) {
  try {
    const product = await productService.createProductService(
      req.body,
      req.user.email
    );
    res.status(200).json(product);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
}

export async function putProductController(req, res) {
  const { id } = req.params;
  try {
    await productService.updateOneService(id, req.body);
    res.json(id);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
}

export async function deleteProductController(req, res) {
  const { id } = req.params;
  try {
    await productService.deleteOneService(id);
    res.json(req.body);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
}
