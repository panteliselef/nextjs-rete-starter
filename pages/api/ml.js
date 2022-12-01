// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(
  req,
  res
) {
  try {
    var bytes = JSON.stringify({ data: "The skin was cut by the scalpel" });
    var api_key = "rOz6xTgnpQtzXSisBi5CkLbFm4wG7adr";
    const mlRes = await fetch(
      "https://asdasdasd.northeurope.inference.ml.azure.com/score",
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + api_key,
          "azureml-model-deployment": "default",
        },
        body: bytes,
      }
    ).then((response) => {
      return response.json();
    });

    res.status(200).json(JSON.parse(mlRes));
  } catch (e) {
    res.status(400).json({ message: "oops" });
  }
}
