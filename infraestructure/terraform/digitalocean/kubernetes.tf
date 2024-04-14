resource "digitalocean_kubernetes_cluster" "kubernetes-nlw-unite" {
  name   = "kube-nlw-unite"
  region = "nyc1"
  version = var.cluster_version

  node_pool {
    name       = "worker-pool"
    size       = "s-2vcpu-2gb"
    node_count = 1
  }
}