window.trig =
  getPointFromVector: (radian) =>
    if radian % (Math.PI*0.5) is 0
      isFlat = true
    else
      isFlat = false
    eight = Math.floor(radian/(Math.PI*0.25))
    vector = {quadrant: Math.floor(radian/(Math.PI*0.5)), isEven: isFlat}
    pi = Math.PI
    if isFlat
      r = vector.quadrant % 2
      x = 1 - r
      y = r
    else
      r = radian - pi*vector.quadrant
      if r > pi/4
        flip = true
        r = pi/2 - r
      switch eight
        when 0 or 3 or 4 or 7
          yFunc = Math.cos
          xFunc = Math.sin
        else
          yFunc = Math.sin
          xFunc = Math.cos
      x = xFunc(r)
      y = yFunc(r)
    switch vector.quadrant
      when 1 then x = -x
      when 2
        x = -x
        y = -y
      when 3 then y = -y
    point = {x: x, y: y}

