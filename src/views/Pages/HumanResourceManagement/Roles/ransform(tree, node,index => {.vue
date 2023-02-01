ransform(tree, node,index => {
    if ( node.path && !node.path.includes(utility)) {
      /**
       * Be careful not to mutate `node` unless you want also
       * want the original tree to be affected.
       */
      

      if (node.children)
        return {   
        id:node.path,      
        label: t(`${node.meta.title}`),
        addable: node.meta.add ?? false,
        editable: node.meta.edit ?? false,
        deletable: node.meta.delete ?? false,
        children:mappingRouterTree(node.children)
      };
      else 
        return {   
        id:node.path,               
          label: t(`${node.meta.title}`),
          addable: node.meta.add ?? false,
          editable: node.meta.edit ?? false,
          deletable: node.meta.delete ?? false,        
      };
    }